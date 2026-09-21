import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { Mastra } from '@mastra/core';
import { LibSQLStore } from '@mastra/libsql';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

// 语义召回需要嵌入模型：DeepSeek 无 embedding API，
// 用 OpenAI 兼容协议直连 DashScope 兼容模式（text-embedding-v3）——
// 与 Java 侧 spring-ai-alibaba 组的嵌入方案一致。可换任意 OpenAI 兼容嵌入服务。
const embedder = createOpenAICompatible({
  name: 'dashscope',
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  apiKey: process.env.DASHSCOPE_API_KEY ?? '',
}).textEmbeddingModel('text-embedding-v3');

export const recallAgent = new Agent({
  id: 'recall-agent',
  name: 'Semantic Recall Agent',
  instructions: '你是一个有长期记忆的助手，回答简短。优先依据召回的历史对话回答。',
  model: 'deepseek/deepseek-chat',
  memory: new Memory({
    embedder,
    options: {
      lastMessages: 5,
      // semanticRecall：按语义（向量相似度）跨消息检索历史，而非只看最近 N 条
      semanticRecall: {
        topK: 3,
        messageRange: 2,
      },
    },
  }),
});

