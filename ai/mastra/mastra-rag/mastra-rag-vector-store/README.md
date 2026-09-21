# mastra-rag-vector-store — 向量存储：LibSQLVector upsert + query（本地文件零部署）

## 演示内容

向量存储：LibSQLVector upsert + query（本地文件零部署）。

```bash
cd ai/mastra/mastra-rag/mastra-rag-vector-store
pnpm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
npx tsx src/demo.ts    # 程序化演示
npx mastra dev         # 或启动 dev server + Studio
```

> 嵌入默认 DashScope 兼容模式 text-embedding-v3，需 DASHSCOPE_API_KEY。
