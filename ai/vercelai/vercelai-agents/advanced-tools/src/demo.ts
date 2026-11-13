/**
 * AI SDK 7 工具进阶：dynamicTool / activeTools / prepareStep / repairToolCall
 *
 * - dynamicTool：schema 运行时才知道（MCP 工具、插件市场的标准形态）
 * - activeTools：注册一堆工具，但每轮只暴露子集给模型
 * - prepareStep：每一步开跑前动态改参数/换工具集
 * - repairToolCall：模型吐了坏 JSON / 不存在的工具时自动修复（v7 已去掉 experimental_ 前缀）
 *
 * 对照：langchainjs-agents/agent-middleware 的工具治理部分。
 *
 * 运行：pnpm --filter vercelai-agents-advanced-tools demo
 */
import { generateText, tool, dynamicTool, stepCountIs } from 'ai';
import { z } from 'zod';
import { createChatModel } from 'vercelai-shared';

// ---- 静态工具：编译期类型完整 ----
const clock = tool({
  description: '查询当前时间',
  inputSchema: z.object({}),
  execute: async () => ({ now: new Date().toISOString() }),
});

// ---- dynamicTool：schema 运行时才知道——execute 入参类型被抹成 unknown ----
const searchDocs = dynamicTool({
  description: '在产品文档里搜索关键词',
  inputSchema: z.object({ keyword: z.string().describe('搜索关键词') }),
  execute: async (rawInput) => {
    const { keyword } = rawInput as { keyword: string };
    return {
      keyword,
      hits: [`《${keyword}》使用指南`, `FAQ：关于 ${keyword} 的三个常见问题`],
    };
  },
});

async function main(): Promise<void> {
  const model = createChatModel();

  // ---- 1. dynamicTool + activeTools（顶层收窄：这轮只给模型 searchDocs）----
  const r1 = await generateText({
    model,
    instructions: '回答前先用搜索工具查资料，再总结一句话。',
    prompt: '搜一下"缓存清理"的资料并总结。',
    tools: { searchDocs, clock },
    activeTools: ['searchDocs'],
    stopWhen: stepCountIs(6),
  });
  console.log('【1】dynamicTool + activeTools:', r1.text, '\n');

  // ---- 2. prepareStep：按步换策略（先搜索；总结阶段收走搜索防空转）----
  const r2 = await generateText({
    model,
    instructions: '先搜索资料，然后总结。总结阶段不要再搜索。',
    prompt: '帮我查"导出报表"的资料并总结。',
    tools: { searchDocs, clock },
    prepareStep: ({ stepNumber }) => {
      // 返回值可覆盖 model / activeTools / toolChoice / instructions / temperature …
      return stepNumber === 0 ? { activeTools: ['searchDocs'] } : { activeTools: ['clock'] };
    },
    stopWhen: stepCountIs(6),
  });
  console.log('【2】prepareStep:', r2.text, '\n');

  // ---- 3. repairToolCall：坏调用自动修复（返回 null 则中止）----
  const r3 = await generateText({
    model,
    prompt: '查一下"版本升级"的资料，一句话总结。',
    tools: { searchDocs, clock },
    repairToolCall: async ({ toolCall }) => {
      console.log('    ⚠️ 触发修复：', toolCall.toolName, '←', toolCall.input);
      try {
        // 常见修复：模型输出的 JSON 带注释/单引号——修成合法 JSON 再回填
        const parsed = JSON.parse(toolCall.input) as unknown;
        return { ...toolCall, input: JSON.stringify(parsed) };
      } catch {
        return null; // 修不了：SDK 抛出原始错误
      }
    },
    stopWhen: stepCountIs(6),
  });
  console.log('【3】repairToolCall:', r3.text);
}

main().catch((error) => {
  console.error('demo 失败:', error);
  process.exitCode = 1;
});
