import { embedMany } from 'ai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { MDocument } from '@mastra/rag';
import { LibSQLVector } from '@mastra/libsql';

/**
 * 向量存储：嵌入 → upsert → 相似度查询。
 *
 * 嵌入端点：DeepSeek 无 embedding API，用 OpenAI 兼容协议直连
 * DashScope 兼容模式（text-embedding-v3）—— 可用 EMBEDDING_BASE_URL /
 * EMBEDDING_MODEL 环境变量换成任意 OpenAI 兼容嵌入服务。
 * 向量库用 LibSQLVector（本地文件，零部署）；生产可换 pgvector / Qdrant 等。
 */
export const embedder = createOpenAICompatible({
  name: 'dashscope',
  baseURL: process.env.EMBEDDING_BASE_URL ?? 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  apiKey: process.env.DASHSCOPE_API_KEY ?? '',
}).textEmbeddingModel(process.env.EMBEDDING_MODEL ?? 'text-embedding-v3');

export const vectorStore = new LibSQLVector({
  id: 'saa-vector-store',
  url: 'file:vector-store.db',
});

const docs = [
  'Spring AI Alibaba 的 Graph 框架用 StateGraph 声明节点与边，支持 checkpoint 恢复。',
  'Mastra 的 workflow 用 createWorkflow 和 createStep 声明式编排，支持 suspend/resume。',
  '通义千问 qwen-plus 通过 DashScope 的 OpenAI 兼容模式接入。',
  'AgentScope 是阿里巴巴开源的 ReAct 循环 Agent 框架。',
];

export async function ingest() {
  const doc = MDocument.fromText(docs.join('\n'), { type: 'text' });
  const chunks = await doc.chunk({ strategy: 'recursive', maxSize: 120, overlap: 10 });

  const { embeddings } = await embedMany({
    values: chunks.map((c: { text: string }) => c.text),
    model: embedder,
  });

  await vectorStore.upsert({
    indexName: 'tutorials',
    vectors: embeddings as number[][],
    metadata: chunks.map((c: { text: string }, i: number) => ({
      text: c.text,
      source: i < 2 ? 'framework' : 'provider',
    })),
  });
  console.log(`已入库 ${embeddings.length} 个向量（索引 tutorials）`);
}

export async function search(query: string, topK = 2) {
  const { embeddings } = await embedMany({ values: [query], model: embedder });
  const results = await vectorStore.query({
    indexName: 'tutorials',
    queryVector: embeddings[0] as number[],
    topK,
  });
  return results;
}
