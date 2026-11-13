# guardrails — vercelai middleware 模块

护栏中间件：PII 入向/出向双向脱敏 + 思维链分离。

## 运行

```bash
cd ai/vercelai
pnpm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
pnpm --filter vercelai-middleware-guardrails demo
```

## 演示内容

1. **入向脱敏**（`transformParams`）：provider 级 `prompt` 是消息数组——system 是字符串、user/assistant 内容里翻 `type: 'text'` 的 part 做正则替换。手机号/证件号/邮箱在**离开应用前**就被替换成占位符，demo 里日志显示模型实际收到的是 `[手机号]`/`[邮箱]`（连复述都拒绝了——它根本看不到真实号码）
2. **出向脱敏**（`wrapGenerate`）：模型编出来的"示例联系方式"进应用前再扫一遍
3. **思维链分离**：`deepseek-reasoner` 的 `reasoning-delta` / `text-delta` 在流里天然分开（官方 provider 已拆好）；思考内容不进对话记录

## 关键认知

- **洋葱模型**：外层中间件的 `transformParams` 先执行——要观测"脱敏后"的请求，日志中间件要包在脱敏中间件**内层**（demo 1 的组装顺序就是为此）
- `extractReasoningMiddleware({ tagName })` 用于另一场景：走 `@ai-sdk/openai-compatible` 接内联 `<think>` 标签的第三方网关时手动拆思维链；官方 provider 已原生分离，无需它

## 对照

- langchainjs：`langchainjs-guardrails/guardrails-middleware`（RunnableLambda 包模型的同款思路）
