/**
 * AI SDK 7 嵌入：embed / embedMany + 本地 BGE EmbeddingModel + cosineSimilarity
 *
 * 零 API key：LocalBGEEmbeddingModel 实现了 EmbeddingModelV4 接口，
 * 于是 embed()/embedMany() 直接吃本地 ONNX 模型（shared 包提供）。
 * 对照：langchainjs-rag/rag-embeddings-local（同一个 BGE 模型，LangChain 的 Embeddings 类）。
 *
 * 运行：pnpm --filter vercelai-rag-embeddings demo
 * （首次运行会从 hf-mirror 下载约 30MB 模型）
 */
import { embed, embedMany, cosineSimilarity } from 'ai';
import { LocalBGEEmbeddingModel } from 'vercelai-shared';

const docs = [
  '今天杭州天气晴朗，适合出门跑步。',
  'TypeScript 的类型系统在编译期就能抓住大部分低级错误。',
  '红烧肉的关键在于炒糖色和小火慢炖。',
  '西湖十景中最出名的是苏堤春晓和断桥残雪。',
  '力量训练后 30 分钟内补充蛋白质效果最好。',
];

async function main(): Promise<void> {
  const model = new LocalBGEEmbeddingModel();

  // ---- 1. embed：单条文本 → 向量 ----
  const { embedding, usage } = await embed({
    model,
    value: '人工智能正在改变软件开发的方式。',
  });
  console.log('【1】embed 单条：维度 =', embedding.length, '| 估算 tokens =', usage?.tokens);

  // ---- 2. embedMany：批量嵌入（SDK 按 maxEmbeddingsPerCall 自动分批）----
  const { embeddings } = await embedMany({ model, values: docs });
  console.log('【2】embedMany 批量：', embeddings.length, '条 →', embeddings[0].length, '维');

  // ---- 3. cosineSimilarity：语义检索（主包自带，不用引向量库）----
  const { embedding: query } = await embed({ model, value: '周末去哪玩比较好？' });
  const ranked = docs
    .map((doc, i) => ({ doc, score: cosineSimilarity(query, embeddings[i]) }))
    .sort((a, b) => b.score - a.score);
  console.log('\n【3】查询"周末去哪玩比较好？"的语义排序:');
  for (const { doc, score } of ranked) {
    console.log(`    ${score.toFixed(4)}  ${doc}`);
  }
}

main().catch((error) => {
  console.error('demo 失败:', error);
  process.exitCode = 1;
});
