# mastra-pattern-orchestrator — 编排者-工人：结构化拆解 → parallel 并行执行 → 汇总

## 演示内容

编排者-工人：结构化拆解 → parallel 并行执行 → 汇总。

```bash
cd ai/mastra/mastra-patterns/mastra-pattern-orchestrator
pnpm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
npx tsx src/demo.ts    # 程序化演示
npx mastra dev         # 或启动 dev server + Studio
```

> 与其他组 orchestrator-workers 1:1 对照。已 typecheck 通过。
