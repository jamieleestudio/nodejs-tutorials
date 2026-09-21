# ① 基础（mastra-basics）

## 这一章解决什么

Agent 的最小闭环：generate / stream / 结构化输出 / 动态模型。model router 原生接入 DeepSeek。

## 模块清单

| 模块 | 端口 | 主题 | 运行 |
|---|---|---|---|
| [mastra-chat](./mastra-chat/README.md) | 8600 | 最小聊天 Agent | `GET /api/agents/chat-agent/generate` |
| [mastra-streaming](./mastra-streaming/README.md) | 8601 | 流式输出 | `npx tsx src/demo.ts` |
| [mastra-structured-output](./mastra-structured-output/README.md) | 8602 | 结构化输出 | `npx tsx src/demo.ts` |
| [mastra-dynamic-model](./mastra-dynamic-model/README.md) | 8603 | 动态模型切换 | `npx tsx src/demo.ts` |
