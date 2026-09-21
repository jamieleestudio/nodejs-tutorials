# mastra-workflow-parallel — 并行执行：.parallel([...]) 并发 + 隐式 barrier 汇合

## 演示内容

并行执行：.parallel([...]) 并发 + 隐式 barrier 汇合。

```bash
cd ai/mastra/mastra-workflows/mastra-workflow-parallel
pnpm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
npx tsx src/demo.ts    # 程序化演示
npx mastra dev         # 或启动 dev server + Studio
```

> parallel 输出按 step id 分组，merge 步骤的 inputSchema 需嵌套声明。已运行验证。
