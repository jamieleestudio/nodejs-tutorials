import { createStep, createWorkflow } from '@mastra/core/workflows';
import { Agent } from '@mastra/core/agent';
import { Mastra } from '@mastra/core';
import { LibSQLStore } from '@mastra/libsql';
import { z } from 'zod';

// 人工审批工作流：generate 出方案 → suspend 挂起等审批 → 恢复后按反馈落地
const planner = new Agent({
  id: 'planner',
  name: 'Planner',
  instructions: '你是策划，输出 3 条要点的执行方案，只输出方案。',
  model: 'deepseek/deepseek-chat',
});

const executor = new Agent({
  id: 'executor',
  name: 'Executor',
  instructions: '你是执行者，按方案与人工反馈输出落地结果。',
  model: 'deepseek/deepseek-chat',
});

const planStep = createStep({
  id: 'plan',
  inputSchema: z.object({ input: z.string() }),
  outputSchema: z.object({ proposal: z.string() }),
  execute: async ({ inputData, mastra }) => {
    const agent = mastra?.getAgentById('planner');
    const r = await agent!.generate(`为下面的需求拟一个 3 条要点的执行方案：\n${inputData.input}`);
    return { proposal: r.text };
  },
});

// suspendSchema / resumeSchema 定义挂起与恢复的数据形态
const approvalStep = createStep({
  id: 'approval',
  inputSchema: z.object({ proposal: z.string() }),
  outputSchema: z.object({ proposal: z.string(), feedback: z.string() }),
  resumeSchema: z.object({ approved: z.boolean(), feedback: z.string() }),
  suspendSchema: z.object({ message: z.string() }),
  execute: async ({ inputData, resumeData, suspend }) => {
    // resumeData 存在 = 恢复执行（已审批）
    if (resumeData) {
      return {
        proposal: inputData.proposal,
        feedback: resumeData.approved ? resumeData.feedback : '已驳回，按驳回处理',
      };
    }
    // 首次进入 → 挂起，把待审批内容抛给调用方
    await suspend({
      message: '方案待审批：' + inputData.proposal,
    });
    // suspend 不抛异常，execute 会在这里返回 undefined 由引擎接管
    return { proposal: inputData.proposal, feedback: '' };
  },
});

const finalizeStep = createStep({
  id: 'finalize',
  inputSchema: z.object({ proposal: z.string(), feedback: z.string() }),
  outputSchema: z.object({ result: z.string() }),
  execute: async ({ inputData, mastra }) => {
    const agent = mastra?.getAgentById('executor');
    const r = await agent!.generate(
      `按人工反馈修订并落地这个方案。\n方案：\n${inputData.proposal}\n人工反馈：${inputData.feedback}`,
    );
    return { result: r.text };
  },
});

export const approvalWorkflow = createWorkflow({
  id: 'approval-workflow',
  inputSchema: z.object({ input: z.string() }),
  outputSchema: z.object({ result: z.string() }),
})
  .then(planStep)
  .then(approvalStep)
  .then(finalizeStep)
  .commit();

export const mastra = new Mastra({
  agents: { planner, executor },
  workflows: { approvalWorkflow },
  storage: new LibSQLStore({
    id: 'wf-suspend-storage',
    url: 'file:workflow-suspend.db',
  }),
  server: { port: 8615 },
});
