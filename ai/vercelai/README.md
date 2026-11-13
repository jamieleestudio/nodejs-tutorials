# vercelai — Vercel AI SDK 7 教程组

Vercel AI SDK（`ai` 包）是 TS 生态的「模型层底座」：`generateText` / `streamText` / 工具循环 / 结构化输出 / 流式 UI 协议。三层定位一目了然：

| 层 | 组 | 特点 |
|---|---|---|
| 底座 | **vercelai（本组）** | 只管"怎么调模型"，框架级能力（图引擎/记忆/MCP server）交给上层 |
| 框架 | mastra | 建立在 AI SDK 之上的全功能 agent 框架 |
| 全家桶 | langchainjs | 自带模型抽象 + 全家桶生态，自成一体 |

组内模块尽量标注与另两组的对照关系。

## 模块总览（9 分类 · 18 模块 + shared）

| 分类 | 模块 | 演示点 | 对照 langchainjs | 状态 |
|---|---|---|---|---|
| **basics** | [generate](vercelai-basics/generate/) | generateText / streamText、instructions、usage/finishReason、messages 多轮 | chat-models | ✅ |
| | [structured-output](vercelai-basics/structured-output/) | generateText/streamText + Output（object/array/choice/json；旧 generateObject/streamObject 已 deprecated） | agent-structured-output | ✅ |
| | [providers](vercelai-basics/providers/) | 官方 @ai-sdk/deepseek vs @ai-sdk/openai-compatible、错误分类、V4 thinking | chat-models（换模型类） | ✅ |
| **agents** | [tool-loop](vercelai-agents/tool-loop/) | tool() + stopWhen（stepCountIs / hasToolCall）、onStepFinish、steps 审计 | agent-basics | ✅ |
| | [agent-class](vercelai-agents/agent-class/) | ToolLoopAgent（generate/stream + 类型推断） | agent-basics | ✅ |
| | [advanced-tools](vercelai-agents/advanced-tools/) | dynamicTool / activeTools / prepareStep / repairToolCall | agent-middleware | ✅ |
| **streaming** | [primitives](vercelai-streaming/primitives/) | stream 事件类型、consumeStream、simulateReadableStream | streaming | ✅ |
| | [transform](vercelai-streaming/transform/) | smoothStream 平滑输出、partialOutputStream 部分 JSON 流 | streaming | ✅ |
| **rag** | [embeddings](vercelai-rag/embeddings/) | embed / embedMany + 自定义 EmbeddingModel（本地 BGE）+ cosineSimilarity | rag-embeddings-local | ✅ |
| | [pipeline](vercelai-rag/pipeline/) | 切块→嵌入→内存向量库→检索→带上下文生成 | rag-basics | ✅ |
| **middleware** | [basics](vercelai-middleware/basics/) | wrapLanguageModel 日志/改参、defaultSettingsMiddleware、simulateStreamingMiddleware | — | ✅ |
| | [guardrails](vercelai-middleware/guardrails/) | PII 入/出向脱敏中间件 + 思维链分离（reasoner） | guardrails-middleware | ✅ |
| **mcp** | [stdio](vercelai-mcp/stdio/) | @ai-sdk/mcp createMCPClient + StdioMCPTransport + .tools() 注入 | mcp-stdio | ✅ |
| | [http](vercelai-mcp/http/) | Streamable HTTP 传输——直连 mastra 组 8618 MCP server（跨组联动） | mcp-agent | ✅ |
| **ui** | [chat-server](vercelai-ui/chat-server/) | Hono + toUIMessageStream + createUIMessageStreamResponse 实现 useChat 协议端点（8628），纯 fetch SSE 消费页 | — | ✅ |
| **patterns** | [routing](vercelai-patterns/routing/) | Output.choice 分类 → 分发提示词/参数（路由表） | pattern-routing | ✅ |
| | [parallel-loop](vercelai-patterns/parallel-loop/) | Promise.all 并行 + 生成-评审收敛循环（无图引擎，纯 TS 编排） | pattern-parallel / workflows-cycle | ✅ |
| **capstone** | [support](vercelai-capstone/support/) | 智能客服：ToolLoopAgent + searchFaq(本地 BGE RAG) + lookupOrder + useChat 协议服务端（8629） | capstone-app | ✅ |
| **shared** | vercelai-shared | createChatModel 工厂 + 本地 BGE 嵌入 + .env 加载 | shared | ✅ |

**不做**（DeepSeek/环境不支持，收益低）：generateImage / transcribe 多模态（DeepSeek 无图像语音能力）、Realtime、AI Gateway（需 Vercel 账号）、OpenTelemetry（依赖重）。

## 运行

```bash
cd ai/vercelai
pnpm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY

pnpm --filter vercelai-basics-generate demo   # 跑单个模块
pnpm -r --no-bail typecheck                    # 全组类型检查
```

## 约定

- **模型**：统一 DeepSeek，官方 provider `@ai-sdk/deepseek`，默认模型 ID `deepseek-chat`（shared 的 `createChatModel()` 工厂）
- **嵌入**：DeepSeek 无嵌入 API → RAG 全走本地 transformers.js（bge-small-zh-v1.5，hf-mirror 镜像），零 key
- **端口**：8628（ui/chat-server）、8629（capstone/support），其余模块纯脚本
- **环境**：`DEEPSEEK_API_KEY`（见 `.env.example`），Node >= 22.13

## 版本与 v7 速记（本组实证）

`ai@7.0.170` · `@ai-sdk/deepseek@3.0.84` · `@ai-sdk/mcp@2.0.97` · `zod@4.6.7` · `@ai-sdk/provider@4.0.37`

- `system` → **`instructions`**（旧名兼容但 deprecated）
- 结构化输出转正：`generateText`/`streamText` + `output: Output.object(...)`，结果从 **`result.output`** 取；**`generateObject`/`streamObject` 已 deprecated**；部分对象流改名 **`partialOutputStream`**
- 流式改名：`fullStream` → **`stream`**；UI 流正统 = 独立函数 `toUIMessageStream({ stream: result.stream })` + `createUIMessageStreamResponse({ stream })`（result 的 `.toUIMessageStreamResponse()` 方法已 deprecated）
- **`convertToModelMessages` 是异步的**（返回 `Promise<ModelMessage[]>`，记得 await）
- UIMessageChunk 协议（SSE，`data: [DONE]` 结尾）：`text-delta` 帧的字段是 **`delta`**（stream 事件的 TextStreamPart 里是 `text`）；工具循环里能看到 tool-input-start/delta/available 与 tool-output-available 全过程
- Agent 类定名 **ToolLoopAgent**（别名 Experimental_Agent）；`repairToolCall` 去掉 experimental_ 前缀转正
- MCP 客户端拆到独立包 **`@ai-sdk/mcp`**（stdio 走 `@ai-sdk/mcp/mcp-stdio` 子路径；`transport` 可给 `{ type: 'http', url }` 配置对象或 `StdioMCPTransport` 实例）
- `.stream()`（agent / 流式 API）返回 Promise——**await 后拿到的是 StreamTextResult，交给 toUIMessageStream 时要再取 `.stream`**
- 中间件不再要求 `specificationVersion`；provider 级 V4 结果的 `finishReason` 是对象（取 `.unified`）
