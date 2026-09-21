import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { Mastra } from '@mastra/core';
import { LibSQLStore } from '@mastra/libsql';

// LibSQLStore 支持两种 url：
//   ':memory:'     —— 纯内存（进程退出即失）
//   'file:xxx.db'  —— 本地文件，进程重启后数据仍在（生产换 Postgres/Upstash 等）
export const persistentAgent = new Agent({
  id: 'persistent-agent',
  name: 'Persistent Memory Agent',
  instructions: '你是一个跨会话记忆助手。利用历史对话上下文回答，回答简短。',
  model: 'deepseek/deepseek-chat',
  memory: new Memory({
    options: { lastMessages: 20 },
  }),
});

