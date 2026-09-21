# mastra-memory-working — 工作记忆：resource 级用户档案，跨 thread 生效

## 演示内容

工作记忆：resource 级用户档案，跨 thread 生效。

```bash
cd ai/mastra/mastra-memory/mastra-memory-working
pnpm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
npx tsx src/demo.ts    # 程序化演示
npx mastra dev         # 或启动 dev server + Studio
```

> 自定义档案模板，agent 自动填充。需要 DEEPSEEK_API_KEY。已运行验证。
