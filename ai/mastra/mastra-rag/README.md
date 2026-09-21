# ④ RAG（mastra-rag）

## 这一章解决什么

文档分块 → 嵌入 → 向量库 → 检索工具。嵌入默认走 DashScope 兼容模式（OpenAI 兼容协议）。

## 模块清单

| 模块 | 端口 | 主题 | 运行 |
|---|---|---|---|
| [mastra-rag-chunking](./mastra-rag-chunking/README.md) | 8610 | 文档分块（无网络） | `npx tsx src/demo.ts` |
| [mastra-rag-vector-store](./mastra-rag-vector-store/README.md) | 8611 | 向量存储增查 | `npx tsx src/demo.ts` |
| [mastra-rag-pipeline](./mastra-rag-pipeline/README.md) | 8612 | RAG 管道 + Agent | `npx tsx src/demo.ts` |
