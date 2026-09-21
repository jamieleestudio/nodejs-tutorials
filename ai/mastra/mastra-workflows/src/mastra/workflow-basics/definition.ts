import { createStep, createWorkflow } from '@mastra/core/workflows';
import { Agent } from '@mastra/core/agent';
import { Mastra } from '@mastra/core';
import { z } from 'zod';

// 步骤 1：纯函数步骤 —— 提取关键词（无 LLM）
const extractStep = createStep({
  id: 'extract',
  inputSchema: z.object({ input: z.string() }),
  outputSchema: z.object({ keywords: z.string() }),
  execute: async ({ inputData }) => ({
    // 简单规则：取前 12 个字符作为"关键词"，演示非 LLM 步骤
    keywords: inputData.input.slice(0, 12),
  }),
});

// 步骤 2：LLM 步骤 —— 按 keywords 扩写成短文（步骤里调用 Agent）
export const writerAgent = new Agent({
  id: 'writer',
  name: 'Writer',
  instructions: '你是写作助手，按给定关键词写一段 80 字左右的中文短文。',
  model: 'deepseek/deepseek-chat',
});

const writeStep = createStep({
  id: 'write',
  inputSchema: z.object({ keywords: z.string() }),
  outputSchema: z.object({ article: z.string() }),
  execute: async ({ inputData, mastra }) => {
    const agent = mastra?.getAgentById('writer');
    const r = await agent!.generate(`围绕关键词写一段 80 字左右的中文短文：${inputData.keywords}`);
    return { article: r.text };
  },
});

// 步骤 3：纯函数步骤 —— 打上水印前缀
const polishStep = createStep({
  id: 'polish',
  inputSchema: z.object({ article: z.string() }),
  outputSchema: z.object({ result: z.string() }),
  execute: async ({ inputData }) => ({
    result: `[Mastra 生成] ${inputData.article}`,
  }),
});

export const writingWorkflow = createWorkflow({
  id: 'writing-workflow',
  inputSchema: z.object({ input: z.string() }),
  outputSchema: z.object({ result: z.string() }),
})
  .then(extractStep) // 数据自动沿步骤的 outputSchema → inputSchema 传递
  .then(writeStep)
  .then(polishStep)
  .commit();

