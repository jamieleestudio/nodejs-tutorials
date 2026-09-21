import { createStep, createWorkflow } from '@mastra/core/workflows';
import { Agent } from '@mastra/core/agent';
import { Mastra } from '@mastra/core';
import { z } from 'zod';

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
      `把问题分类为 tech / food / general 三类之一，只输出类名：${inputData.input}`,
      { structuredOutput: { schema: z.object({ lane: z.string() }) } },
    );
    const lane = r.object.lane.trim().toLowerCase();
    return { lane: ['tech', 'food'].includes(lane) ? lane : 'general', input: inputData.input };
  },
});

export const expertAgent = new Agent({
  id: 'expert',
  name: 'Expert',
  instructions: '你是领域专家，按括号里的视角要求回答，两句话以内。',
  model: 'deepseek/deepseek-chat',
});

// 三个专家步骤：同一个 agent、不同视角；输出 schema 一致，便于 branch 后直接收尾
const expertStep = (id: string, persona: string) =>
  createStep({
    id,
    inputSchema: z.object({ lane: z.string(), input: z.string() }),
    outputSchema: z.object({ answer: z.string(), lane: z.string() }),
    execute: async ({ inputData, mastra }) => {
      const agent = mastra?.getAgentById('expert');
      const r = await agent!.generate(`（${persona}）回答：${inputData.input}`);
      return { answer: r.text, lane: inputData.lane };
    },
  });

const tech = expertStep('expert-tech', '技术视角，给出可操作的排查步骤');
const food = expertStep('expert-food', '美食视角');
const general = expertStep('expert-general', '通用客服视角');

export const routingWorkflow = createWorkflow({
  id: 'routing-workflow',
  inputSchema: z.object({ input: z.string() }),
  outputSchema: z.object({ answer: z.string(), lane: z.string() }),
})
  .then(classifyStep)
  .branch([
    [async ({ inputData }) => inputData.lane === 'tech', tech],
    [async ({ inputData }) => inputData.lane === 'food', food],
    [async ({ inputData }) => inputData.lane === 'general', general],
  ])
  .commit();

