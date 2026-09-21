import { Agent } from '@mastra/core/agent';
import { createTool } from '@mastra/core/tools';
import { Mastra } from '@mastra/core';
import { createVectorQueryTool } from '@mastra/rag';
import { LibSQLVector } from '@mastra/libsql';
import { embedMany } from 'ai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

export const embedder = createOpenAICompatible({
  name: 'dashscope',
  baseURL: process.env.EMBEDDING_BASE_URL ?? 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  apiKey: process.env.DASHSCOPE_API_KEY ?? '',
}).textEmbeddingModel(process.env.EMBEDDING_MODEL ?? 'text-embedding-v3');

export const vectorStore = new LibSQLVector({
  id: 'rag-pipeline-store',
  url: 'file:rag-pipeline.db',
});

// createVectorQueryTool：现成的"检索工具"—— agent 自主决定何时检索
export const vectorQueryTool = createVectorQueryTool({
  id: 'knowledge-retrieval',
  description: '检索 Spring AI Alibaba / Mastra 教程知识库的相关片段',
  vectorStore,
  indexName: 'knowledge',
  model: embedder,
  enableFilter: true,
});

// 启动时灌入预置知识（幂等：固定 id 覆盖写入）
const knowledge = [
  { id: 'k1', text: 'Spring AI Alibaba 的 Graph 框架用 StateGraph 声明节点与边，interruptBefore 可在工具节点前挂起等人工审批。' },
  { id: 'k2', text: 'Spring AI Alibaba 的 ReactAgent 通过 builder 装配，配 Hook 实现限流、摘要与 PII 检测。' },
  { id: 'k3', text: 'Spring AI Alibaba 支持通过 Nacos 管理动态提示词，以及把 MCP server 注册进 Nacos 供发现。' },
  { id: 'k4', text: 'Mastra 的 workflow 支持 suspend/resume，工具可以用 requireApproval 声明需要人工审批。' },
];

export async function ensureKnowledge() {
  const { embeddings } = await embedMany({
    values: knowledge.map((k) => k.text),
    model: embedder,
  });
  await vectorStore.upsert({
    indexName: 'knowledge',
    vectors: embeddings as number[][],
    metadata: knowledge.map((k) => ({ text: k.text })),
    ids: knowledge.map((k) => k.id),
  });
  console.log(`知识库就绪（${knowledge.length} 条）`);
}

export const ragAgent = new Agent({
  id: 'rag-agent',
  name: 'Knowledge Assistant',
  instructions: `
    你是 SAA / Mastra 教程知识助手。回答前先用 knowledge-retrieval 工具检索相关片段，
    基于检索结果回答；检索不到的信息要诚实说明。回答简短。
  `,
  model: 'deepseek/deepseek-chat',
  tools: { vectorQueryTool },
});

export const mastra = new Mastra({
  agents: { ragAgent },
  server: { port: 8612 },
});
