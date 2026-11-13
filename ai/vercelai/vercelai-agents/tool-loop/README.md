# tool-loop — vercelai agents 模块

Agent 的最小形态：`tool()` + `generateText` 的多步循环。

## 运行

```bash
cd ai/vercelai
pnpm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
pnpm --filter vercelai-agents-tool-loop demo
```

## 演示内容

1. **多步循环**：模型决定调工具 → SDK 执行 `execute` → 结果回填 → 继续，直到 `stopWhen` 满足（默认 `stepCountIs(20)`）。demo 同时挂 `onStepFinish` 观察每步
2. **steps 审计**：`result.steps` 回看每一步的 `toolCalls`（`.toolName` / `.input`）与 `toolResults`
3. **停止条件**：`stopWhen: stepCountIs(10)` 限步数；`hasToolCall('getWeather')` 调过指定工具就停（数组 = 任一满足即停）

## 关键认知

- 工具签名 = zod schema：`inputSchema` + `execute`，SDK 自动转 JSON Schema 给模型
- `instructions`（v7 新名）代替 `system` 设置系统提示

## 对照

- langchainjs：`langchainjs-agents/agent-basics`（createReactAgent 的隐式循环， LangChain 把循环藏进 executor，AI SDK 把循环摆在 `stopWhen` 参数上）
