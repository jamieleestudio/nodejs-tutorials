# ① 基础（8600）

## 这一章解决什么

Agent 的最小闭环。

## 模块清单（src/demos/ 下的演示脚本）

| 演示 | 内容 |
|---|---|
| [src/demos/chat.ts](./src/demos/chat.ts) | 最小聊天 Agent：generate() + model router 接入 DeepSeek |
| [src/demos/streaming.ts](./src/demos/streaming.ts) | 流式输出：textStream 逐 token + fullStream 事件流 |
| [src/demos/structured-output.ts](./src/demos/structured-output.ts) | 结构化输出：structuredOutput: { schema } + response.object |
| [src/demos/dynamic-model.ts](./src/demos/dynamic-model.ts) | 动态模型：RequestContext 切换 deepseek-chat / deepseek-reasoner |

## 运行

```bash
cd ai/mastra/mastra-basics
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
npx tsx src/demos/<demo>.ts
npx mastra dev         # 或启动本分类 dev server + Studio（端口见标题）
```