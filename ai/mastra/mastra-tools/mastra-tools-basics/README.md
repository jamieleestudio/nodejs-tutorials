# mastra-tools-basics — 工具调用：createTool() 必须带 Zod inputSchema + execute

## 演示内容

工具调用：createTool() 必须带 Zod inputSchema + execute。

```bash
cd ai/mastra/mastra-tools/mastra-tools-basics
pnpm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
npx tsx src/demo.ts    # 程序化演示
npx mastra dev         # 或启动 dev server + Studio
```

> 普通对象工具会静默失效。已运行验证（weatherTool + calculatorTool 两次调用）。
