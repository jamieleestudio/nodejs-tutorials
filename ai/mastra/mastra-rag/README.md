# ④ RAG（8603）

## 这一章解决什么

检索增强。
> 需要额外环境变量：DASHSCOPE_API_KEY（嵌入，见 .env.example）。

## 模块清单（src/demos/ 下的演示脚本）

| 演示 | 内容 |
|---|---|
| [src/demos/rag-chunking.ts](./src/demos/rag-chunking.ts) | 文档分块：MDocument recursive / markdown 策略（纯本地） |
| [src/demos/rag-vector-store.ts](./src/demos/rag-vector-store.ts) | 向量存储：LibSQLVector upsert + query |
| [src/demos/rag-pipeline.ts](./src/demos/rag-pipeline.ts) | RAG 管道：createVectorQueryTool 注入 Agent 自主检索 |

## 运行

```bash
cd ai/mastra/mastra-rag
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
npx tsx src/demos/<demo>.ts
npx mastra dev         # 或启动本分类 dev server + Studio（端口见标题）
```