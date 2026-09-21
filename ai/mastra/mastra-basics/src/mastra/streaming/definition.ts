import { Agent } from '@mastra/core/agent';
import { Mastra } from '@mastra/core';

export const streamingAgent = new Agent({
  id: 'streaming-agent',
  name: 'Streaming Agent',
  instructions: '你是一个简洁的中文写作助手，擅长写短文。',
  model: 'deepseek/deepseek-chat',
});

