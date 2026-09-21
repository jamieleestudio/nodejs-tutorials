import { mastra } from '../mastra/index.ts';

const agent = mastra.getAgentById('approval-agent');

// generate 版审批流：需要审批时立即返回 finishReason: 'suspended'
const output = await agent.generate('查一下订单 1001 的状态，然后把结果发邮件通知 wang@example.com', {
  requireToolApproval: ({ toolName }: { toolName: string }) => toolName.includes('email'),
});

if (output.finishReason === 'suspended') {
  console.log('待审批工具:', output.suspendPayload?.toolName);
  console.log('参数:', JSON.stringify(output.suspendPayload?.args));

  // 审批通过后继续执行（生产中这一步由审批回调触发）
  const result = await agent.approveToolCallGenerate({
    runId: output.runId!,
    toolCallId: output.suspendPayload?.toolCallId as string,
  });
  console.log('最终结果:', result.text);
} else {
  console.log('无需审批，直接完成:', output.text);
}
