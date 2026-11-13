# pipeline — vercelai rag 模块

手搓最小 RAG 流水线：切块 → 嵌入 → 内存向量库 → 检索 → 带上下文生成。

## 运行

```bash
cd ai/vercelai
pnpm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
pnpm --filter vercelai-rag-pipeline demo
```

## 演示内容

1. **索引**：FAQ 文本按行切块 → `embedMany` 批量嵌入 → 存成内存"向量库"（`Array<{ text, vector }>`)
2. **检索**：问题嵌入 → `cosineSimilarity` 全量打分 → top-2
3. **生成**：检索上下文拼进 prompt + `instructions` 限定"只依据资料回答，不足则明说"→ `generateText`

## 关键认知

- RAG = 检索 + 生成两个原语的组合，AI SDK 不需要"RAG 框架"就能搭最小可用版
- 提示词护栏很重要：没有"资料不足要明说"的约束，模型会硬编

## 对照

- langchainjs：`langchainjs-rag/rag-basics`（MemoryVectorStore + 检索链，框架替你组合）
- 规模化方向：换真向量库（见 langchainjs-rag/rag-vectorstore）、换递归/语义切块
