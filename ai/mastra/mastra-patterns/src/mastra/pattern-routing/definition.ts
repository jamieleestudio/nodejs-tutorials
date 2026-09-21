import { createStep, createWorkflow } from '@mastra/core/workflows';
import { Agent } from '@mastra/core/agent';
import { Mastra } from '@mastra/core';
import { z } from 'zod';

/**
 * 路由模式（Anthropic Routing 的 Mastra Workflow 实现）：
 * 结构化分类 → branch 条件分发 → 各视角专家。
 * 与 java-tutorials 四个组的 patterns/routing 1:1 对照。
 */
export const classifier = new Agent({
  id: 'classifier',
  name: 'Classifier',
  instructions: '你是分类器，只输出类名。',
  model: 'deepseek/deepseek-chat',
});

const classifyStep = createStep({
  id: 'classify',
  inputSchema: z.object({ input: z.string() }),
  outputSchema: z.object({ lane: z.string(), input: z.string() }),
  execute: async ({ inputData, mastra }) => {
    const agent = mastra?.getAgentById('classifier');
    const r = await agent!.generate(
      `客户请求分类：billing（账单/扣费/退款）/ technical（故障/报错/使用）/ general（其他）。只输出类名。\n请求：${inputData.input}`,
      { structuredOutput: { schema: z.object({ lane: z.string() }) } },
    );
    const lane = r.object.lane.trim().toLowerCase();
    return { lane: ['billing', 'technical'].includes(lane) ? lane : 'general', input: inputData.input };
  },
});

export const supportAgent = new Agent({
  id: 'support-expert',
  name: 'Support Expert',
  instructions: '你是客服专家，按括号里的身份要求处理请求，回答简洁。',
  model: 'deepseek/deepseek-chat',
});

const expertStep = (id: string, persona: string) =>
  createStep({
    id,
    inputSchema: z.object({ lane: z.string(), input: z.string() }),
    outputSchema: z.object({ answer: z.string(), lane: z.string() }),
    execute: async ({ inputData, mastra }) => {
      const agent = mastra?.getAgentById('support-expert');
      const r = await agent!.generate(`（${persona}）处理请求：${inputData.input}`);
      return { answer: r.text, lane: inputData.lane };
    },
  });

const billing = expertStep('expert-billing', '账单专家，谨慎对待退款承诺');
const technical = expertStep('expert-technical', '技术支持专家，给出排查步骤');
const general = expertStep('expert-general', '通用客服，礼貌简洁');

export const routingWorkflow = createWorkflow({
  id: 'pattern-routing',
  inputSchema: z.object({ input: z.string() }),
  outputSchema: z.object({ answer: z.string(), lane: z.string() }),
})
  .then(classifyStep)
  .branch([
    [async ({ inputData }) => inputData.lane === 'billing', billing],
    [async ({ inputData }) => inputData.lane === 'technical', technical],
    [async ({ inputData }) => inputData.lane === 'general', general],
  ])
  .commit();

