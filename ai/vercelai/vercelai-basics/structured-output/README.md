# structured-output — vercelai basics 模块

结构化输出：`generateText` / `streamText` + `Output`（v7 正统姿势）。

## 运行

```bash
cd ai/vercelai
pnpm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
pnpm --filter vercelai-basics-structured-output demo
```

## 演示内容

1. **generateText + Output.object**：zod schema 同时是「给模型的约束 + TS 类型（`z.infer`）+ 运行时校验」；不符合 schema 抛 `NoObjectGeneratedError`（可配 `maxRetries` 自动重试）；结果从 **`result.output`** 取
2. **streamText + Output.object + partialOutputStream**：每个事件都是"到目前为止校验过的半成品对象"（`DeepPartial<Movie>`），流式渲染表单/UI 的标准姿势；`await stream.output` 拿终值
3. **Output.choice / Output.array**：单选分类与元素数组的其他形态

> v7 变化：`Output` 命名空间已转正并扩军（`text/object/array/choice/json`）；
> 旧 API `generateObject` / `streamObject` 仍可用但已标记 deprecated（新代码请用 output 参数）。

## 对照

- langchainjs：`langchainjs-agents/agent-structured-output`（`.withStructuredOutput(schema)`）
- mastra：structured output 同款 Zod 约定
