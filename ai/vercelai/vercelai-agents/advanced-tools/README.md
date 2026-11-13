# advanced-tools — vercelai agents 模块

工具进阶控制：`dynamicTool` / `activeTools` / `prepareStep` / `repairToolCall`。

## 运行

```bash
cd ai/vercelai
pnpm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
pnpm --filter vercelai-agents-advanced-tools demo
```

## 演示内容

1. **dynamicTool**：schema 运行时才知道（MCP 工具/插件市场的标准形态）——代价是 `execute` 入参类型被抹成 `unknown`，需自行断言；配合 `activeTools: ['searchDocs']` 顶层收窄
2. **prepareStep**：每步开跑前动态覆盖 `activeTools` / `toolChoice` / `model` / `instructions` / `temperature`…（demo：先搜索，总结阶段收走搜索工具防空转）
3. **repairToolCall**：模型吐坏 JSON / 不存在的工具时自动修复，修不了返回 `null` 中止。v7 已去掉 `experimental_` 前缀转正（旧名仍兼容）

## 关键认知

- `activeTools` 收窄只影响"给模型看什么"，注册表和结果类型不变——治理大工具表的性能与噪音
- `prepareStep` 的返回 `{ ... } & LanguageModelCallOptions` 还能按步换模型（A/B 路由的底层原语）

## 对照

- langchainjs：`langchainjs-agents/agent-middleware` 的工具治理部分
