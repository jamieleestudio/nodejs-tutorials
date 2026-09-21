import { Mastra } from '@mastra/core';
import { LibSQLStore } from '@mastra/libsql';
import { toolAgent } from './tools-basics/definition.ts';
import { coordinator, translator, summarizer } from './subagents/definition.ts';
import { approvalAgent } from './tool-approval/definition.ts';

export const mastra = new Mastra({
  agents: { toolAgent, coordinator, translator, summarizer, approvalAgent },
  // tool-approval 的 requireApproval 依赖 snapshot，需要持久化 storage
  storage: new LibSQLStore({ id: 'tools-storage', url: 'file:tools.db' }),
  server: { port: 8601 },
});
