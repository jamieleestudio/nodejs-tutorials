# basics — vercelai middleware 模块

`wrapLanguageModel` 三板斧：日志观测、默认参数、模拟流式。

## 运行

```bash
cd ai/vercelai
pnpm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
pnpm --filter vercelai-middleware-basics demo
```

## 演示内容

1. **日志中间件**：`transformParams` 进看请求（temperature/消息数）、`wrapGenerate` 出看结果（耗时/finishReason）。v7 要点：中间件不再要求 `specificationVersion`；`wrapGenerate` 里拿到的是 provider 级 V4 结果——`finishReason` 是对象，取 `.unified`
2. **defaultSettingsMiddleware**：给模型实例定默认参数；中间件可**数组叠加**（defaults + logging），调用处显式传参覆盖默认值
3. **simulateStreamingMiddleware**：把只支持一次性生成的模型"伪装"成流式——不写假模型就能测流式代码路径

## 关键认知

- 中间件作用在**模型实例**层（`wrapLanguageModel({ model, middleware })`），产出的仍是 `LanguageModel`——对 generateText/streamText/agent 全透明
- 多个中间件 = 洋葱模型：外层 `transformParams` 先执行（见 ../guardrails 的入向脱敏）

## 对照

- langchainjs：`langchainjs-guardrails/guardrails-middleware` 的模型包装思路
