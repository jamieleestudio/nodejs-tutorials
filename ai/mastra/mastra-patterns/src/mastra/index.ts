import { Mastra } from '@mastra/core';
import { LibSQLStore } from '@mastra/libsql';
import { classifier, supportAgent } from './pattern-routing/definition.ts';
import { routingWorkflow } from './pattern-routing/definition.ts';
import { reviewer } from './pattern-parallel/definition.ts';
import { parallelWorkflow } from './pattern-parallel/definition.ts';
import { orchestrator, worker } from './pattern-orchestrator/definition.ts';
import { orchestratorWorkflow } from './pattern-orchestrator/definition.ts';
import { supervisor, translator, summarizer } from './pattern-supervisor/definition.ts';

export const mastra = new Mastra({
  agents: {
    classifier,
    supportExpert: supportAgent,
    reviewer,
    orchestrator,
    worker,
    translator,
    summarizer,
    supervisor,
  },
  workflows: { routingWorkflow, parallelWorkflow, orchestratorWorkflow },
  // supervisor 的委派链上下文依赖 memory + storage
  storage: new LibSQLStore({ id: 'patterns-storage', url: 'file:patterns.db' }),
  server: { port: 8607 },
});
