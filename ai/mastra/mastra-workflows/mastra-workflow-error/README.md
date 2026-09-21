# mastra-workflow-error — 错误处理：易错步骤内捕获降级 → branch 走 fallback

## 演示内容

错误处理：易错步骤内捕获降级 → branch 走 fallback。

```bash
cd ai/mastra/mastra-workflows/mastra-workflow-error
pnpm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
npx tsx src/demo.ts    # 程序化演示
npx mastra dev         # 或启动 dev server + Studio
```

> 整个 workflow 不 failed；degraded 标记驱动兜底分支。
