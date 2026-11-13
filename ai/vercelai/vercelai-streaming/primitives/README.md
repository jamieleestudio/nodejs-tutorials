# primitives — vercelai streaming 模块

流式原语：`stream` 事件流 / `consumeStream` / `simulateReadableStream`。

## 运行

```bash
cd ai/vercelai
pnpm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
pnpm --filter vercelai-streaming-primitives demo
```

## 演示内容

1. **stream 事件流**：v7 里 `fullStream` 已改名 **`stream`**（旧名 deprecated）。`text-delta` 只是事件之一——demo 打印了完整事件序列 `start → start-step → text-start → text-delta×N → text-end → finish-step → finish`，`finish` 事件带 `finishReason` 与 `totalUsage`
2. **consumeStream**：后台消费流不阻塞主流程；`result.text` 等终值属性会自动等流结束
3. **simulateReadableStream**：把假数据变成带延迟的"流"——不调真模型就能测试流式 UI

## 对照

- langchainjs：`langchainjs-basics/streaming`（AIMessageChunk 流 + streamEvents）
