import { Agent } from '@mastra/core/agent';
import { Mastra } from '@mastra/core';
import { z } from 'zod';

export type TaskContext = {
  'task-type': 'reasoning' | 'chat';
};

export const mastra = new Mastra({
  agents: {
    dynamicAgent: new Agent({
      id: 'dynamic-agent',
      name: 'Dynamic Agent',
      instructions: '你是一个智能助手，回答简洁准确。',
      // 动态模型：按 RequestContext 在普通对话与深度推理之间切换
      // （对照 Java 侧 MultiModelController 的 provider 路由）
      model: ({ requestContext }) => {
        const taskType = requestContext.get('task-type') as TaskContext['task-type'];
        return taskType === 'reasoning' ? 'deepseek/deepseek-reasoner' : 'deepseek/deepseek-chat';
      },
    }),
  },
  server: { port: 8603 },
});

export const taskContextSchema = z.object({
  'task-type': z.enum(['reasoning', 'chat']).default('chat'),
});
