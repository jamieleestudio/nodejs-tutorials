# mastra-streaming — 流式输出：textStream 逐 token + fullStream 事件流

## 演示内容

流式输出：textStream 逐 token + fullStream 事件流。

```bash
cd ai/mastra/mastra-basics/mastra-streaming
pnpm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
npx tsx src/demo.ts    # 程序化演示
npx mastra dev         # 或启动 dev server + Studio
```

> 需要 DEEPSEEK_API_KEY。对照 Java 侧 ChatModel.stream 返回 Flux<String>。
