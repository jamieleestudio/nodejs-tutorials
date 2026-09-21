# mastra-rag-pipeline — RAG 管道：createVectorQueryTool 注入 Agent 自主检索

## 演示内容

RAG 管道：createVectorQueryTool 注入 Agent 自主检索。

```bash
cd ai/mastra/mastra-rag/mastra-rag-pipeline
pnpm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
npx tsx src/demo.ts    # 程序化演示
npx mastra dev         # 或启动 dev server + Studio
```

> 需要 DASHSCOPE_API_KEY（嵌入）。与 java 侧 capstone 的知识库方案同构。
