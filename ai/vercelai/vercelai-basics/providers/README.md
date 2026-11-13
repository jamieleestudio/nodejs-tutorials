# providers — vercelai basics 模块

Provider 抽象对照：官方 `@ai-sdk/deepseek` vs 通用 `@ai-sdk/openai-compatible`。

## 运行

```bash
cd ai/vercelai
pnpm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
pnpm --filter vercelai-basics-providers demo
```

## 演示内容

1. **官方 provider**：`createDeepSeek({ apiKey, baseURL })` → 可直接调用 `provider(modelId)` 或 `provider.chat(modelId)`；自带 DeepSeek 错误结构与专属选项
2. **通用 openai-compatible**：`createOpenAICompatible({ name, baseURL, apiKey })` → `.chatModel(id)`。任何"OpenAI 兼容"端点（Ollama/vLLM/OpenRouter/OneAPI）换 `baseURL` 即接
3. **错误分类**：`APICallError.isInstance(error)`（看 `statusCode` / `isRetryable`）→ `AISDKError.isInstance(error)` 兜底，精确到类型处理

## DeepSeek V4 专属选项（备注）

`deepseek-v4-flash` / `deepseek-v4-pro` 支持：

- `thinking: { type: 'enabled' | 'disabled' }`——开关思维链
- `reasoningEffort: 'low' | 'high' | 'max'`——思考力度

通过 `providerOptions: { deepseek: { ... } }` 传入；`deepseek-chat` 别名走非思考模式。

## 对照

- langchainjs：`langchainjs-basics/chat-models` 里 ChatOpenAI ↔ ChatAnthropic 的替换关系（AI SDK 把这层抽象下放到了 provider 包）
