# mastra-structured-output — 结构化输出：structuredOutput: { schema } + response.object

## 演示内容

结构化输出：structuredOutput: { schema } + response.object。

```bash
cd ai/mastra/mastra-basics/mastra-structured-output
npm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
npx tsx src/demo.ts    # 程序化演示
npx mastra dev         # 或启动 dev server + Studio
```

> Zod schema 定义输出形状，强类型取值。已运行验证。对照 Spring AI 的 entity(Class)。
