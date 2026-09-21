import { createStep, createWorkflow } from '@mastra/core/workflows';
import { Agent } from '@mastra/core/agent';
import { Mastra } from '@mastra/core';
import { z } from 'zod';

/**
 * 编排者-工人模式（Anthropic Orchestrator-Workers）：
 * 编排者用结构化输出把目标拆成固定上限的子任务 → workflow parallel 并行执行 → 汇总。
 */
export const orchestrator = new Agent({
  id: 'orchestrator',
  name: 'Orchestrator',
  instructions: '你是任务编排者，把目标拆解为子任务。',
  model: 'deepseek/deepseek-chat',
});

export const worker = new Agent({
  id: 'worker',
  name: 'Worker',
  instructions: '你是执行工人，按子任务输出工作成果（两句话以内）。',
  model: 'deepseek/deepseek-chat',
});

const decomposeStep = createStep({
  id: 'decompose',
  inputSchema: z.object({ goal: z.string() }),
  outputSchema: z.object({
    tasks: z.array(z.object({ title: z.string(), detail: z.string() })).max(3),
  }),
  execute: async ({ inputData, mastra }) => {
    const agent = mastra?.getAgentById('orchestrator');
    const r = await agent!.generate(`把目标拆成最多 3 个子任务（title + detail）：${inputData.goal}`, {
      structuredOutput: {
        schema: z.object({
          tasks: z.array(z.object({ title: z.string(), detail: z.string() })).max(3),
        }),
      },
    });
    return { tasks: r.object.tasks };
  },
});

const tasksSchema = z.object({
  tasks: z.array(z.object({ title: z.string(), detail: z.string() })).max(3),
});

// 固定 3 个工人槽位；拆解不足 3 个时多余槽位输出占位文本
const worker0 = createStep({
  id: 'worker-0',
  inputSchema: tasksSchema,
  outputSchema: z.object({ w0: z.string() }),
  execute: async ({ inputData, mastra }) => {
    const task = inputData.tasks[0];
    if (!task) return { w0: '（空槽位）' };
    const agent = mastra?.getAgentById('worker');
    const r = await agent!.generate(`执行子任务「${task.title}」：${task.detail}`);
    return { w0: r.text };
  },
});

const worker1 = createStep({
  id: 'worker-1',
  inputSchema: tasksSchema,
  outputSchema: z.object({ w1: z.string() }),
  execute: async ({ inputData, mastra }) => {
    const task = inputData.tasks[1];
    if (!task) return { w1: '（空槽位）' };
    const agent = mastra?.getAgentById('worker');
    const r = await agent!.generate(`执行子任务「${task.title}」：${task.detail}`);
    return { w1: r.text };
  },
});

const worker2 = createStep({
  id: 'worker-2',
  inputSchema: tasksSchema,
  outputSchema: z.object({ w2: z.string() }),
  execute: async ({ inputData, mastra }) => {
    const task = inputData.tasks[2];
    if (!task) return { w2: '（空槽位）' };
    const agent = mastra?.getAgentById('worker');
    const r = await agent!.generate(`执行子任务「${task.title}」：${task.detail}`);
    return { w2: r.text };
  },
});

const mergeStep = createStep({
  id: 'merge',
  inputSchema: z.object({
    'worker-0': z.object({ w0: z.string() }),
    'worker-1': z.object({ w1: z.string() }),
    'worker-2': z.object({ w2: z.string() }),
  }),
  outputSchema: z.object({ summary: z.string() }),
  execute: async ({ inputData, mastra }) => {
    const agent = mastra?.getAgentById('orchestrator');
    const r = await agent!.generate(
      `汇总工人们的成果（两句话以内）：\n${inputData['worker-0'].w0}\n${inputData['worker-1'].w1}\n${inputData['worker-2'].w2}`,
    );
    return { summary: r.text };
  },
});

export const orchestratorWorkflow = createWorkflow({
  id: 'pattern-orchestrator',
  inputSchema: z.object({ goal: z.string() }),
  outputSchema: z.object({ summary: z.string() }),
})
  .then(decomposeStep)
  .parallel([worker0, worker1, worker2])
  .then(mergeStep)
  .commit();

