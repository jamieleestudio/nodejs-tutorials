import { Mastra } from '@mastra/core';
import { chatAgent } from './chat/agents/chat-agent.ts';
import { streamingAgent } from './streaming/definition.ts';
import { extractAgent } from './structured-output/definition.ts';
import { dynamicAgent } from './dynamic-model/definition.ts';

export const mastra = new Mastra({
  agents: { chatAgent, streamingAgent, extractAgent, dynamicAgent },
  server: { port: 8600 },
});
