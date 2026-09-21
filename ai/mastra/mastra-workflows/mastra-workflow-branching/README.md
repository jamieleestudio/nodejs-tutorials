# mastra-workflow-branching — 分支路由：.branch([[谓词, 步骤], ...])

## 演示内容

分支路由：.branch([[谓词, 步骤], ...])。

```bash
cd ai/mastra/mastra-workflows/mastra-workflow-branching
pnpm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
npx tsx src/demo.ts    # 程序化演示
npx mastra dev         # 或启动 dev server + Studio
```

> branch 输出按 step id 分组，从 result.steps 取命中分支。已运行验证。
