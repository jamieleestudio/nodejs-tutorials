import { MemoryVectorStore } from '@langchain/classic/vectorstores/memory';
import { ChatOpenAI } from '@langchain/openai';
import { LocalBGEEmbeddings } from 'langchainjs-shared';

/**
 * RAG 进阶：手写 QueryRouter —— 按关键词把问题路由到不同检索源
 * （产品知识库 / 政策知识库），对照 Java 侧 DefaultRetrievalAugmentor + QueryRouter。
 * pnpm strict 隔离下历史消息实例需重建（同 memory-history 的处理）。
 */
const embeddings = new LocalBGEEmbeddings();

const productStore = new MemoryVectorStore(embeddings);
const policyStore = new MemoryVectorStore(embeddings);

const productDocs = [
  'Spring AI Alibaba 提供本地 BGE 中文嵌入模型，无需 API key 即可向量化。',
  'LangChain4j 的 AiServices 支持把任意接口变成 AI 服务。',
];
const policyDocs = [
  '教程仓库的所有示例仅供学习，禁止用于生产环境。',
  '仓库内容基于 Apache 2.0 协议开源。',
];

for (const [i, text] of productDocs.entries()) {
  await productStore.addDocuments([{ pageContent: text, metadata: { source: 'product' } }]);
}
for (const [i, text] of policyDocs.entries()) {
  await policyStore.addDocuments([{ pageContent: text, metadata: { source: 'policy' } }]);
}

const model = new ChatOpenAI({
  model: 'deepseek-chat',
  apiKey: process.env.DEEPSEEK_API_KEY,
  configuration: { baseURL: 'https://api.deepseek.com' },
});

async function answer(question: string): Promise<string> {
  const store = question.includes('协议') || question.includes('学习') ? policyStore : productStore;
  const relevant = await store.similaritySearch(question, 2);
  const context = relevant.map((d) => d.pageContent).join('\n');
  const response = await model.invoke(
    `基于以下上下文回答问题，上下文没有的信息要说明。\n上下文：\n${context}\n\n问题：${question}`,
  );
  return String(response.content);
}

async function main(): Promise<void> {
  console.log('[产品问题]', await answer('BGE 嵌入需要 API key 吗？'));
  console.log('[政策问题]', await answer('仓库基于什么协议开源？'));
}

main();
