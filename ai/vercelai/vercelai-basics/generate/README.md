# generate — vercelai basics 模块

AI SDK 7 的两把基础刷子：`generateText`（一次性）与 `streamText`（流式）。

## 运行

```bash
cd ai/vercelai
pnpm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
pnpm --filter vercelai-basics-generate demo
```

## 演示内容

1. **generateText**：`instructions`（v7 新名，取代 `system`，旧名仍兼容）+ `prompt` + `temperature` / `maxOutputTokens` / `maxRetries`，结果取 `.text` / `.usage` / `.finishReason`
2. **streamText**：返回"流句柄"——`textStream` 立刻可迭代，`usage` / `steps` 等 await 后取终值
3. **messages 多轮**：`messages: [{ role: 'user' | 'assistant', content }]` 自带对话历史

## 关键认知

- 业务代码只依赖 `LanguageModel` 接口：换供应商 = 换"造模型"那一行（见 ../providers）
- `streamText` 不发请求直到消费流（惰性），忘消费 = 请求根本没发出

## 对照

- langchainjs：`langchainjs-basics/chat-models`（ChatOpenAI + invoke/stream）
- mastra：`agent.generate()` 的底层同款原语
