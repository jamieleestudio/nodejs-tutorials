# embeddings — vercelai rag 模块

嵌入三原语：`embed` / `embedMany` / `cosineSimilarity`——全部吃本地模型，零 API key。

## 运行

```bash
cd ai/vercelai
pnpm install
cp .env.example .env   # 无需 key（本地推理）
pnpm --filter vercelai-rag-embeddings demo   # 首次运行下载 ~30MB 模型
```

## 演示内容

1. **embed 单条**：`LocalBGEEmbeddingModel`（shared 包）实现 AI SDK 的 **EmbeddingModelV4** 接口——`specificationVersion: 'v4'` + `provider/modelId/maxEmbeddingsPerCall/supportsParallelCalls` + `doEmbed()`，于是 AI SDK 的嵌入 API 直接吃本地 ONNX（Xenova/bge-small-zh-v1.5，512 维，hf-mirror 镜像）
2. **embedMany 批量**：SDK 按 `maxEmbeddingsPerCall: 16` 自动分批
3. **cosineSimilarity**：主包自带的余弦相似度做语义排序——不引向量库就能做小型检索

## 关键认知

- DeepSeek 不提供嵌入 API → 组内 RAG 全走本地 transformers.js（与 langchainjs-rag 同一模型）
- 自定义 provider 就是"实现一个接口"：把任何嵌入源（本地/自建 HTTP 服务）接进 AI SDK 生态

## 对照

- langchainjs：`langchainjs-rag/rag-embeddings-local`（同一个 BGE 模型，LangChain 的 `Embeddings` 基类）
