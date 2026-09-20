import { createStep, createWorkflow } from '@mastra/core/workflows';
import { Agent } from '@mastra/core/agent';
import { Mastra } from '@mastra/core';
import { z } from 'zod';

// 并行模式：三位评审并发 → 汇合出结论（与 Graph 扇出/扇入同构）
const reviewer = new Agent({
  id: 'reviewer',
  name: 'Reviewer',
  instructions: '你是评审，一句话点评。',
  model: 'deepseek/deepseek-chat',
});

const reviewInput = z.object({ input: z.string() });

const techStep = createStep({
  id: 'review-tech',
  inputSchema: reviewInput,
  outputSchema: z.object({ tech: z.string() }),
  execute: async ({ inputData, mastra }) => {
    const agent = mastra?.getAgentById('reviewer');
    const r = await agent!.generate('（技术可行性）一句话点评：' + inputData.input);
    return { tech: r.text };
  },
});

const bizStep = createStep({
  id: 'review-biz',
  inputSchema: reviewInput,
  outputSchema: z.object({ biz: z.string() }),
  execute: async ({ inputData, mastra }) => {
    const agent = mastra?.getAgentById('reviewer');
    const r = await agent!.generate('（商业价值）一句话点评：' + inputData.input);
    return { biz: r.text };
  },
});

const uxStep = createStep({
  id: 'review-ux',
  inputSchema: reviewInput,
  outputSchema: z.object({ ux: z.string() }),
  execute: async ({ inputData, mastra }) => {
    const agent = mastra?.getAgentById('reviewer');
    const r = await agent!.generate('（用户体验）一句话点评：' + inputData.input);
    return { ux: r.text };
  },
});

const mergeStep = createStep({
  id: 'merge',
  inputSchema: z.object({
    'review-tech': z.object({ tech: z.string() }),
    'review-biz': z.object({ biz: z.string() }),
    'review-ux': z.object({ ux: z.string() }),
  }),
  outputSchema: z.object({ verdict: z.string() }),
  execute: async ({ inputData, mastra }) => {
    const tech = inputData['review-tech'].tech;
    const biz = inputData['review-biz'].biz;
    const ux = inputData['review-ux'].ux;
    const agent = mastra?.getAgentById('reviewer');
    const r = await agent!.generate(
      `综合三位评审给出最终结论（两句话以内）：\n技术：${tech}\n业务：${biz}\n体验：${ux}`,
    );
    return { verdict: r.text };
  },
});

export const parallelWorkflow = createWorkflow({
  id: 'pattern-parallel',
  inputSchema: z.object({ input: z.string() }),
  outputSchema: z.object({ verdict: z.string() }),
})
  .parallel([techStep, bizStep, uxStep])
  .then(mergeStep)
  .commit();

export const mastra = new Mastra({
  agents: { reviewer },
  workflows: { parallelWorkflow },
  server: { port: 8622 },
});
