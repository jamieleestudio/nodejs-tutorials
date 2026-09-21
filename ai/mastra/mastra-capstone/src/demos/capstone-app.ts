import { mastra } from '../mastra/index.ts';
import { ensureKnowledge } from '../mastra/capstone-app/definition.ts';

await ensureKnowledge();

const agent = mastra.getAgentById('support-agent');
const memoryOpts = { memory: { resource: 'user-42', thread: 'support-session' } } as const;

// 1. FAQ（RAG 检索知识库）
const r1 = await agent.generate('退款政策是怎样的？', memoryOpts);
console.log('[FAQ]', r1.text);

// 2. 查订单（工具）
const r2 = await agent.generate('帮我看看订单 1001 到哪了', memoryOpts);
console.log('\n[订单]', r2.text);

// 3. 退款（工具审批 HITL）：generate 会在工具调用前挂起
const output = await agent.generate('那我把订单 1002 退了吧，商品还没拆封', {
  ...memoryOpts,
  requireToolApproval: ({ toolName }: { toolName: string }) => toolName === 'submit-refund',
});

if (output.finishReason === 'suspended') {
  console.log('\n[待审批]', JSON.stringify(output.suspendPayload));
  // 模拟审批系统回调：放行
  const resumed = await agent.approveToolCallGenerate({
    runId: output.runId!,
    toolCallId: output.suspendPayload?.toolCallId as string,
  });
  console.log('\n[审批后]', resumed.text);
} else {
  console.log('\n[直接完成]', output.text);
}
