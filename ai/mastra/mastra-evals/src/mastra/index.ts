import { Mastra } from '@mastra/core';
import { LibSQLStore } from '@mastra/libsql';
import { createAnswerRelevancyScorer } from '@mastra/evals/scorers/prebuilt';
import { checks } from '@mastra/evals/checks';
import { evaluatedAgent } from './evals/definition.ts';

export const mastra = new Mastra({
  agents: { evaluatedAgent },
  scorers: {
    includesKeyword: checks.includes('Mastra'),
    relevancy: createAnswerRelevancyScorer({ model: 'deepseek/deepseek-chat' }),
  },
  storage: new LibSQLStore({ id: 'evals-storage', url: 'file:evals.db' }),
  server: { port: 8606 },
});
