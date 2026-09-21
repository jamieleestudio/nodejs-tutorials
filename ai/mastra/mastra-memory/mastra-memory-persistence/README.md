# mastra-memory-persistence — 记忆持久化：LibSQLStore file 落盘，重启后历史仍在

## 演示内容

记忆持久化：LibSQLStore file 落盘，重启后历史仍在。

```bash
cd ai/mastra/mastra-memory/mastra-memory-persistence
npm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
npx tsx src/demo.ts    # 程序化演示
npx mastra dev         # 或启动 dev server + Studio
```

> demo 分 write / read 两次进程演示。生产换 Postgres 等持久 provider。
