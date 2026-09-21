import { Mastra } from '@mastra/core';
import { LibSQLStore } from '@mastra/libsql';
import { supportAgent } from './capstone-app/definition.ts';

export const mastra = new Mastra({
  agents: { supportAgent },
  storage: new LibSQLStore({ id: 'capstone-storage', url: 'file:capstone.db' }),
  server: { port: 8608 },
});
