import { createStep, createWorkflow } from '@mastra/core/workflows';
import { Agent } from '@mastra/core/agent';
import { Mastra } from '@mastra/core';
import { z } from 'zod';

/**
 * 错误处理：LLM 步骤可能抛错（超时/限流/内容策略）。
 * 模式：易错步骤内部捕获并降级输出 → 后续步骤按"是否降级"走 fallback 分支，
 * 整个 workflow 不会 failed。对照 Java 侧 workflow 的 try/catch + fallback 分支。
 */
export const flakyAgent = new Agent({
  id: 'flaky-agent',
  name: 'Flaky Fetcher',
  instructions: '你是一个数据查询助手。',
  model: 'deepseek/deepseek-chat',
});

const fetchStep = createStep({
  id: 'fetch-data',
  inputSchema: z.object({ query: z.string() }),
  outputSchema: z.object({
    data: z.string(),
    degraded: z.boolean(),
  }),
  execute: async ({ inputData, mastra }) => {
    try {
      const agent = mastra?.getAgentById('flaky-agent');
      const r = await agent!.generate(`查询并返回：${inputData.query}（模拟可能失败的外部调用）`);
      return { data: r.text, degraded: false };
    } catch (e) {
      // 降级：不抛出，标记 degraded 让后续步骤走兜底
      return { data: `查询失败：${(e as Error).message}`, degraded: true };
    }
  },
});

const primaryStep = createStep({
  id: 'primary-processing',
  inputSchema: z.object({ data: z.string(), degraded: z.boolean() }),
  outputSchema: z.object({ output: z.string() }),
  execute: async ({ inputData }) => ({
    output: `主处理完成：${inputData.data}`,
  }),
});

const fallbackStep = createStep({
  id: 'fallback-processing',
  inputSchema: z.object({ data: z.string(), degraded: z.boolean() }),
  outputSchema: z.object({ output: z.string() }),
  execute: async ({ inputData }) => ({
    output: `走兜底路径（缓存默认值），原始错误信息已保留：${inputData.data}`,
  }),
});

export const resilientWorkflow = createWorkflow({
  id: 'resilient-workflow',
  inputSchema: z.object({ query: z.string() }),
  outputSchema: z.object({ output: z.string() }),
})
  .then(fetchStep)
  .branch([
    [async ({ inputData }) => !inputData.degraded, primaryStep],
    [async ({ inputData }) => inputData.degraded, fallbackStep],
  ])
  .commit();

