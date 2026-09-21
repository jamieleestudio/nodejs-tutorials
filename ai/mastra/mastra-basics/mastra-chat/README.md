# mastra-chat — 最小聊天 Agent：generate() + model router 接入 DeepSeek

## 演示内容

最小聊天 Agent：generate() + model router 接入 DeepSeek。

```bash
cd ai/mastra/mastra-basics/mastra-chat
pnpm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
npx tsx src/demo.ts    # 程序化演示
npx mastra dev         # 或启动 dev server + Studio
```

> 需要 DEEPSEEK_API_KEY。已运行验证。`mastra dev` 打开 Studio 调试。
