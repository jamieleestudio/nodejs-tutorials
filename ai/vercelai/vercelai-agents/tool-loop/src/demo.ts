/**
 * AI SDK 7 Agent 原语：tool + generateText 多步循环
 *
 * 循环机制：模型决定调工具 → SDK 执行 execute → 结果回填对话 → 模型继续，
 * 直到 stopWhen 条件满足（默认 stepCountIs(20)）。
 * 对照：langchainjs-agents/agent-basics（createReactAgent 的隐式循环）。
 *
 * 运行：pnpm --filter vercelai-agents-tool-loop demo
 */
import { generateText, tool, stepCountIs, hasToolCall } from 'ai';
import { z } from 'zod';
import { createChatModel } from 'vercelai-shared';

// ---- 定义工具：zod schema 即工具签名（自动转 JSON Schema 给模型）----
const getWeather = tool({
  description: '查询指定城市的当前天气',
  inputSchema: z.object({
    city: z.string().describe('城市名，如"北京"'),
  }),
  execute: async ({ city }) => {
    console.log(`    ⚙️  execute getWeather(${city})`);
    // 演示用假数据源；真实项目里这里是 fetch 外部 API / 查数据库
    const table: Record<string, { temperature: number; condition: string }> = {
      '北京': { temperature: 8, condition: '晴，风大' },
      '上海': { temperature: 16, condition: '阴' },
      '广州': { temperature: 26, condition: '阵雨' },
    };
    return table[city] ?? { temperature: 20, condition: '未知' };
  },
});

async function main(): Promise<void> {
  const model = createChatModel();

  // ---- 1. 多步工具循环 ----
  const result = await generateText({
    model,
    instructions: '你是天气助手。回答穿衣建议前必须先查对应城市的天气。',
    prompt: '北京和上海今天适合穿什么？',
    tools: { getWeather },
    stopWhen: stepCountIs(10),
    onStepFinish: (step) => {
      console.log(`— 一步结束：${step.toolCalls.length} 个工具调用，finishReason=${step.finishReason}`);
    },
  });
  console.log('【1】最终回答:', result.text, '\n');

  // ---- 2. steps 审计：回看每一步做了什么 ----
  for (const [i, step] of result.steps.entries()) {
    for (const call of step.toolCalls) {
      console.log(`【2】step#${i} 调用 ${call.toolName}:`, call.input);
    }
  }

  // ---- 3. hasToolCall：调用过指定工具就立刻停（不再要总结）----
  const capped = await generateText({
    model,
    instructions: '你是天气助手。',
    prompt: '广州今天天气怎么样？',
    tools: { getWeather },
    stopWhen: hasToolCall('getWeather'),
  });
  console.log('【3】hasToolCall 停止后 text:', capped.text || '(模型只调了工具，循环已按条件终止)');
}

main().catch((error) => {
  console.error('demo 失败:', error);
  process.exitCode = 1;
});
