import { MemoryVectorStore } from '@langchain/classic/vectorstores/memory';
import { LocalBGEEmbeddings } from 'langchainjs-shared';

/**
 * 向量存储：MemoryVectorStore + 本地 BGE-zh 嵌入，addDocuments/similaritySearch。
 * 对照 Java 侧 langchain4j-rag-vector-store 的 InMemoryEmbeddingStore。
 */
const embeddings = new LocalBGEEmbeddings();
const store = new MemoryVectorStore(embeddings);

const docs = [
  'Spring AI Alibaba 的 Graph 框架用 StateGraph 声明节点与边。',
  'Mastra 的 workflow 用 createWorkflow 和 createStep 声明式编排。',
  'LangChain.js 的 LangGraph 支持 interrupt 人工介入与 checkpointer 持久化。',
  'AgentScope 是阿里巴巴开源的 ReAct 循环 Agent 框架。',
];

for (const [i, text] of docs.entries()) {
  await store.addDocuments([{ pageContent: text, metadata: { source: `doc-${i}` } }]);
}

async function main(): Promise<void> {
  const query = '工作流怎么声明？';
  const results = await store.similaritySearch(query, 2);
  console.log(`查询: ${query}`);
  for (const r of results) {
    console.log(`- [${r.metadata.source}] ${r.pageContent}`);
  }
}

main();
