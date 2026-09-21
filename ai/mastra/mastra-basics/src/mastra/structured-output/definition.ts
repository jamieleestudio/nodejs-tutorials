import { Agent } from '@mastra/core/agent';
import { Mastra } from '@mastra/core';
import { z } from 'zod';

export const extractAgent = new Agent({
  id: 'extract-agent',
  name: 'Extract Agent',
  instructions: '你是一个信息抽取助手，严格按给定 schema 返回结构化结果。',
  model: 'deepseek/deepseek-chat',
});

