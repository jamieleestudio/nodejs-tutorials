# mastra-memory-recall — 语义召回：semanticRecall + embedder（DashScope 兼容端点）

## 演示内容

语义召回：semanticRecall + embedder（DashScope 兼容端点）。

```bash
cd ai/mastra/mastra-memory/mastra-memory-recall
npm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
npx tsx src/demo.ts    # 程序化演示
npx mastra dev         # 或启动 dev server + Studio
```

> 需要 DASHSCOPE_API_KEY（或 EMBEDDING_BASE_URL 换兼容服务）。
