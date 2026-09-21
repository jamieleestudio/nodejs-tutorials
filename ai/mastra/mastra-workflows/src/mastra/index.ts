import { Mastra } from '@mastra/core';
import { LibSQLStore } from '@mastra/libsql';
import { writerAgent } from './workflow-basics/definition.ts';
import { writingWorkflow } from './workflow-basics/definition.ts';
import { classifier, expertAgent } from './workflow-branching/definition.ts';
import { routingWorkflow } from './workflow-branching/definition.ts';
import { planner, executor } from './workflow-suspend/definition.ts';
import { approvalWorkflow } from './workflow-suspend/definition.ts';
import { reviewer } from './workflow-parallel/definition.ts';
import { parallelWorkflow } from './workflow-parallel/definition.ts';
import { flakyAgent } from './workflow-error/definition.ts';
import { resilientWorkflow } from './workflow-error/definition.ts';

export const mastra = new Mastra({
  agents: { writer: writerAgent, classifier, expert: expertAgent, planner, executor, reviewer, flaky: flakyAgent },
  workflows: {
    writingWorkflow,
    routingWorkflow,
    approvalWorkflow,
    parallelWorkflow,
    resilientWorkflow,
  },
  // workflow-suspend 的挂起快照需要持久化 storage
  storage: new LibSQLStore({ id: 'workflows-storage', url: 'file:workflows.db' }),
  server: { port: 8604 },
});
