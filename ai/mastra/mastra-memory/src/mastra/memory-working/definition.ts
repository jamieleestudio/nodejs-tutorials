import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { Mastra } from '@mastra/core';
import { LibSQLStore } from '@mastra/libsql';

// workingMemory：结构化的"用户档案"，跨对话持久（默认 resource 级）。
// agent 会自动把档案以系统消息形式注入上下文，并随对话自动更新。
export const workingMemoryAgent = new Agent({
  id: 'working-memory-agent',
  name: 'Working Memory Agent',
  instructions: `
    你是一个有记忆的个人助理。
    用户告诉你个人信息（称呼、偏好等）时，记住它们；
    回答时主动利用已知信息，例如知道用户称呼就直接用。
  `,
  model: 'deepseek/deepseek-chat',
  memory: new Memory({
    options: {
      lastMessages: 20,
      workingMemory: {
        enabled: true,
        // 自定义档案模板：星号包裹的部分由 agent 自动填充
        template: `用户档案：
称呼: 
喜欢的技术: 
当前在学: *（自由记录）*`,
      },
    },
  }),
});

