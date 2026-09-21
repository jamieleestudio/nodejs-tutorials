import { MemoryVectorStore } from '@langchain/classic/vectorstores/memory';
import { ChatOpenAI } from '@langchain/openai';
import { LocalBGEEmbeddings } from 'langchainjs-shared';

/**
 * RAG 基础：MemoryVectorStore + asRetriever() + model 结合检索上下文回答。
 * 对照 Java 侧 langchain4j-rag-basics 的 ContentRetriever + AiServices。
 */
const embeddings = new LocalBGEEmbeddings();
const store = new MemoryVectorStore(embeddings);

const knowledge = [
  'LangChain4j 的 AiServices 用声明式接口封装 AI 调用。',
  'LangChain4j 的 RAG 通过 ContentRetriever 与 RetrievalAugmentor 组合实现。',
  'LangChain4j 的 AgenticScope 是多 Agent 共享的状态容器。',
];
const model = new ChatOpenAI({
  model: 'deepseek-chat',
  apiKey: process.env.DEEPSEEK_API_KEY,
  configuration: { baseURL: 'https://api.deepseek.com' },
});

async function main(): Promise<void> {
  for (const [i, text] of knowledge.entries()) {
    await store.addDocuments([{ pageContent: text, metadata: { id: `k-${i}` } }]);
  }

  const retriever = store.asRetriever(2);
  const question = 'AgenticScope 是什么？';
  const relevant = await retriever.invoke(question);

  console.log('- 检索到', relevant.length, '条：');
  for (const d of relevant) {
    console.log('  -', d.pageContent);
  }

  const context = relevant.map((d) => d.pageContent).join('\n');
  const answer = await model.invoke(
    `基于以下上下文回答问题，上下文没有的信息要说明。\n上下文：\n${context}\n\n问题：${question}`,
  );
  console.log('- 回答:', typeof answer.content === 'string' ? answer.content : JSON.stringify(answer.content));
}

main();
