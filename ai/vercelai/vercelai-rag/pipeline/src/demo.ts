/**
 * AI SDK 7 RAG 流水线：切块 → 嵌入 → 内存向量库 → 检索 → 带上下文生成
 *
 * 用 AI SDK 原语手搓最小 RAG（不引向量库）：embedMany + cosineSimilarity + generateText。
 * 对照：langchainjs-rag/rag-basics（MemoryVectorStore + RetrievalQA 链）。
 *
 * 运行：pnpm --filter vercelai-rag-pipeline demo
 */
import { embed, embedMany, cosineSimilarity, generateText } from 'ai';
import { createChatModel, LocalBGEEmbeddingModel } from 'vercelai-shared';

// ---- 知识库：一段产品 FAQ 原文 ----
const KB = `
退货政策：收到商品后 7 天内可无理由退货，需保持包装完好。退款将在验收后 3 个工作日内原路退回。
发货时效：现货商品 48 小时内发出，预售商品按页面标注时间发货。默认中通快递，可备注顺丰（补差价）。
会员积分：每消费 1 元累计 1 积分，积分在确认收货后 7 天入账。500 积分可兑换 10 元无门槛优惠券。
发票服务：支持电子普通发票与增值税专用发票，下单时在"发票信息"填写，开票金额为实付金额。
`

/** 极简切块：按行分段（真实项目可用递归字符切块 / 语义切块） */
function chunk(text: string): string[] {
  return text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

async function main(): Promise<void> {
  const embeddingModel = new LocalBGEEmbeddingModel();
  const chatModel = createChatModel();

  // ---- 1. 索引：切块 → 批量嵌入 → 内存"向量库" ----
  const chunks = chunk(KB);
  const { embeddings } = await embedMany({ model: embeddingModel, values: chunks });
  const vectorStore = chunks.map((text, i) => ({ text, vector: embeddings[i] }));
  console.log(`【1】索引完成：${vectorStore.length} 个块`);

  // ---- 2. 检索：查询嵌入 → 余弦相似度 top-k ----
  const question = '积分什么时候到账？能换什么？';
  const { embedding: queryVector } = await embed({ model: embeddingModel, value: question });
  const topK = [...vectorStore]
    .map((entry) => ({ ...entry, score: cosineSimilarity(queryVector, entry.vector) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);
  console.log('【2】检索 top-2:');
  for (const { text, score } of topK) {
    console.log(`    ${score.toFixed(4)}  ${text}`);
  }

  // ---- 3. 生成：把检索到的上下文塞进 prompt，让模型只依据资料回答 ----
  const { text } = await generateText({
    model: chatModel,
    instructions: '你是客服助手。只依据给出的资料回答；资料不足以回答时明确说"资料中未提及"。',
    prompt: `资料：\n${topK.map((t) => `- ${t.text}`).join('\n')}\n\n问题：${question}`,
  });
  console.log('\n【3】带上下文生成:', text);
}

main().catch((error) => {
  console.error('demo 失败:', error);
  process.exitCode = 1;
});
