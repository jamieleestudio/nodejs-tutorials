import { Mastra } from '@mastra/core';
import { LibSQLStore } from '@mastra/libsql';
import { workingMemoryAgent } from './memory-working/definition.ts';
import { recallAgent } from './memory-recall/definition.ts';
import { persistentAgent } from './memory-persistence/definition.ts';

export const mastra = new Mastra({
  agents: { workingMemoryAgent, recallAgent, persistentAgent },
  storage: new LibSQLStore({ id: 'memory-storage', url: 'file:memory.db' }),
  server: { port: 8602 },
});
