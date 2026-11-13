# chat-server — vercelai ui 模块

useChat 协议服务端：Hono + `toUIMessageStream` + 纯 fetch SSE 消费页（端口 8628）。

## 运行

```bash
cd ai/vercelai
pnpm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
pnpm --filter vercelai-ui-chat-server demo   # → http://localhost:8628
```

## 演示内容

服务端三步（v7 正统 API）：

1. `convertToModelMessages(messages)`：前端 UIMessage（`role` + `parts`）→ 模型消息
2. `streamText({ instructions, messages })`
3. `createUIMessageStreamResponse({ stream: toUIMessageStream({ stream: result.stream }) })`

页面端不依赖任何框架：纯 `fetch` 读 SSE，逐帧解析 `data: {"type":"text-delta","delta":"…"}`（以 `data: [DONE]` 结束），并把 assistant 回答回填进 UIMessage 数组实现多轮。

## 关键认知

- v7 变化：`result.toUIMessageStreamResponse()` 方法已 deprecated——正统 = 独立函数 **`toUIMessageStream` + `createUIMessageStreamResponse`**
- 协议与框架解耦：`@ai-sdk/react` 的 `useChat` 可直接对接本端点（同一套 UIMessageChunk 协议）；纯 fetch 也能消费，证明它只是普通 SSE
- 手写消费端最易踩的点：UIMessageChunk 的 `text-delta` 字段是 **`delta`**（而 stream/fullStream 的 TextStreamPart 里是 `text`）

## 对照

- langchainjs：无直接对应（UI 消息协议是 AI SDK 生态特有）；服务端形态可对照 capstone 组
