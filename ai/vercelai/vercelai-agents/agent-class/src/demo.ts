/**
 * AI SDK 7 ToolLoopAgent：把"模型 + 工具 + 停止条件 + 指令"封装成可复用对象
 *
 * .generate() 一次性拿结果，.stream() 换流式——同一个 agent 两种消费方式。
 * 类型彩蛋：InferAgentTools<typeof agent> 能从实例反推工具表类型。
 * 对照：mastra Agent（createAgent）；v7 变化：Agent 类定名 ToolLoopAgent
 * （旧别名 Experimental_Agent 仍在）。
 *
 * 运行：pnpm --filter vercelai-agents-agent-class demo
 */
import { ToolLoopAgent, stepCountIs, tool } from 'ai';
import { z } from 'zod';
import { createChatModel } from 'vercelai-shared';

// ---- 工具 1：四则运算 ----
const calculator = tool({
  description: '计算一个四则运算表达式的值',
  inputSchema: z.object({
    expression: z.string().describe('JS 风格算术表达式，如 "128 * 6 + 40"'),
  }),
  execute: async ({ expression }) => {
    // 演示环境信任模型输入；生产请换表达式解析器
    const value = Function(`"use strict"; return (${expression});`)() as number;
    return { expression, value };
  },
});

// ---- 工具 2：日期推算 ----
const daysElapsed = tool({
  description: '查询从年初到指定日期已过去多少天',
  inputSchema: z.object({
    date: z.string().describe('ISO 日期，如 "2026-11-12"'),
  }),
  execute: async ({ date }) => {
    const start = new Date(`${date.slice(0, 4)}-01-01T00:00:00Z`);
    const end = new Date(`${date}T00:00:00Z`);
    const days = Math.round((end.getTime() - start.getTime()) / 86_400_000);
    return { date, daysElapsed: days };
  },
});

// ---- 组装 Agent：instructions / model / tools / stopWhen 一次配好 ----
const assistant = new ToolLoopAgent({
  id: 'calc-assistant',
  instructions:
    '你是计算助手。所有算术和日期推算必须用工具完成，禁止心算；最终答案用一句话给出。',
  model: createChatModel(),
  tools: { calculator, daysElapsed },
  stopWhen: stepCountIs(10),
});

// ---- 类型推断：从 agent 实例反推工具表类型（v7 未导出 InferAgentTools，借 getter 推导）----
const agentTools = assistant.tools;
type AssistantTools = typeof agentTools;
const toolNames: Array<keyof AssistantTools> = ['calculator', 'daysElapsed'];

async function main(): Promise<void> {
  console.log('已注册工具:', toolNames.join(', '));

  // ---- 1. 一次性生成：generate ----
  const result = await assistant.generate({
    prompt: '2026-11-12 已经是今年第几天？2026 年全年 365 天，还剩多少天？',
  });
  console.log('【1】generate:', result.text);
  console.log('    共', result.steps.length, '步');

  // ---- 2. 流式：同一个 agent，换消费方式（stream 返回 Promise）----
  const stream = await assistant.stream({ prompt: '256 * 4 - 128 等于多少？' });
  process.stdout.write('【2】stream: ');
  for await (const delta of stream.textStream) {
    process.stdout.write(delta);
  }
  console.log();
}

main().catch((error) => {
  console.error('demo 失败:', error);
  process.exitCode = 1;
});
