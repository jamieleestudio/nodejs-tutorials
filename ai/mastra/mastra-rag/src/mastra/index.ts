import { Mastra } from '@mastra/core';
import { ragAgent } from './rag-pipeline/definition.ts';

export const mastra = new Mastra({
  agents: { ragAgent },
  server: { port: 8603 },
});
