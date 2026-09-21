import { Mastra } from '@mastra/core';
import { chatAgent } from './agents/chat-agent.ts';

export const mastra = new Mastra({
  agents: { chatAgent },
  // 每个教程模块固定端口（与 java-tutorials 各 AI 组的端口表风格一致）
  server: { port: 8600 },
});
