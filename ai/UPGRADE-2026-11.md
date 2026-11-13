# ai/ 2026-11 升级日志

2026-11 批次的升级与新建记录，覆盖根 `ai/`、`langchainjs`、`mastra`、`vercelai` 四个单元。全部通过 `pnpm -r --no-bail typecheck`，核心链路均实测运行。四组现已统一在 **zod ^4.6.7** 上。

| 单元 | 动作 | commit |
|---|---|---|
| 根 ai/ | openai ^4.67 → **^7.55**、zod ^3.23 → **^4.6.7**，新增 Responses API demo | e433bc3 |
| ai/langchainjs | **LangChain 1.6 栈**升级 + 破坏性迁移 + 2 新模块 | b65e8ab |
| ai/mastra | **Mastra 1.82 栈**升级 + MCP Tasks / Knowledge v2 两新模块 | 277ade1 |
| ai/vercelai | **新建组**：Vercel AI SDK 7（9 分类 · 18 模块 + shared） | 本次 |

## ① 根 ai/ —— openai 7.55

- `openai` ^4.67.0 → **^7.55.0**，`zod` ^3.23.0 → **^4.6.7**
- 既有 chat.completions demo 不受影响（新版兼容）
- 新增 `src/responses-demo.ts`：`client.responses.create` 走 Responses API（OpenAI 新一代接口），注册进 `src/main.ts`

## ② ai/langchainjs —— LangChain 1.6 栈

### 版本

`langchain ^1.6.5` · `@langchain/core ^1.4.0` · `@langchain/openai ^1.8.4` · `@langchain/langgraph ^1.7.3` · `@langchain/mcp-adapters ^2.0.3` · `zod ^4.6.7`

### Breaking changes 迁移（实证）

| 1.0 及以前 | 1.6 正统 |
|---|---|
| `prompt` | `systemPrompt` |
| 自定义工具拦截 | `wrapToolCall(request, handler)`，返回 `ToolMessage \| Command` |
| `MultiServerMCPClient` | `MCPAdapter` + `listTools()`（扁平数组）/ `listToolsets()`（按 server 分组） |
| `BaseMessage` 从 langchain 包引入 | 从 `@langchain/core/messages` 引入 |
| `BaseListChatMessageHistory` 子类 | 需显式声明 `lc_namespace` |
| LangGraph 条件边返回 | `'x' \| typeof END` |
| agent 工具注入时机 | 构造时注入（`tools` 选项） |

### 增强 / 新增

- interrupt demo：typed `responseSchema` + 单节点内两个顺序 interrupt
- 新模块 **agent-decision-models**：Decisions（modelRouter / autoMode / modelRefusal，DeepSeek BaseDecisionModel）
- 新模块 **mcp-elicitation**：mode 'legacy' + onElicitation
- 修复 context-langgraph 缺失的 `@langchain/langgraph` 依赖声明（此前被 hoist 侥幸可用）

## ③ ai/mastra —— Mastra 1.82 栈

### 版本

`@mastra/core ^1.82.0`（Agent Scopes 1.78 / MCP Tasks 1.81 / Knowledge v2 1.82）· `@mastra/mcp ^2.8.0` · `@mastra/memory ^1.41.0` · `@mastra/libsql ^1.29.0` · `@mastra/rag ^2.7.2` · `@mastra/evals ^1.10.11` · mastra CLI ^1.38.0 · `ai ^7.0.170` · `zod ^4.6.7`

### 新增模块

| 模块 | 端口 | 主题 |
|---|---|---|
| mastra-mcp-tasks | 8626 | MCP Tasks 长时工具（SEP-2663）：server `tasks.tools: 'always'`，client 连接 `tasks: true` + `tasksClient.tasks.get()` |
| mastra-knowledge | 8627 | Knowledge v2 页式知识库：scope 访问控制、host `upsertPage`、agent `knowledge` + `scopes: ['org:acme']` |

（28 模块 / 9 分类全景见 [ai/mastra/README.md](mastra/README.md)。）

## ④ ai/vercelai —— Vercel AI SDK 7（新建组）

TS 生态的「模型层底座」：`generateText` / `streamText` / 工具循环 / 结构化输出 / 流式 UI 协议。9 分类 · 18 模块 + shared，全部新建；与 langchainjs（全家桶）、mastra（上层框架）构成三层定位对照。

### 版本

`ai ^7.0.170` · `@ai-sdk/deepseek ^3.0.84` · `@ai-sdk/mcp ^2.0.97` · `@ai-sdk/provider ^4.0.37` · `zod ^4.6.7` · hono ^4.13 / @hono/node-server ^2.1（ui 与 capstone 的服务端）

### v7 API 变化（本组实证）

| v6 及以前 | v7 正统 |
|---|---|
| `system` | `instructions`（旧名 deprecated） |
| `generateObject` / `streamObject` | `generateText`/`streamText` + `output: Output.object(...)`，结果取 **`result.output`**；部分对象流改名 **`partialOutputStream`** |
| `fullStream` | **`stream`** |
| `result.toUIMessageStreamResponse()` 方法 | 独立函数 `toUIMessageStream({ stream: result.stream })` + `createUIMessageStreamResponse({ stream })` |
| `convertToModelMessages` 同步 | **异步**（返回 `Promise<ModelMessage[]>`） |
| `experimental_createMCPClient`（主包） | 独立包 **`@ai-sdk/mcp`**；transport 支持 `{ type: 'http', url }` 配置对象或 `@ai-sdk/mcp/mcp-stdio` 的 `StdioMCPTransport` |
| `Experimental_Agent` | 定名 **ToolLoopAgent**；`repairToolCall` 去 experimental_ 前缀转正 |
| `.stream()` 直接返回流 | 返回 **Promise**，await 后是 StreamTextResult（交给 toUIMessageStream 要再取 `.stream`） |
| 中间件必填 specificationVersion | 免填；provider 级 V4 结果的 `finishReason` 是对象（取 `.unified`） |

协议细节：UIMessageChunk（SSE，`data: [DONE]` 收尾）的 `text-delta` 帧字段是 **`delta`**（stream 事件的 TextStreamPart 里是 `text`）；工具循环全程可见 `tool-input-start/delta/available` 与 `tool-output-available` 帧。

### 模块全景

| 分类 | 模块 |
|---|---|
| basics | generate / structured-output / providers |
| agents | tool-loop / agent-class / advanced-tools（dynamicTool / activeTools / prepareStep / repairToolCall） |
| streaming | primitives / transform（smoothStream + partialOutputStream） |
| rag | embeddings（本地 BGE，零 key）/ pipeline |
| middleware | basics / guardrails（PII 双向脱敏 + 思维链分离） |
| mcp | stdio（server-everything）/ http（跨组直连 mastra 8618 MCP server） |
| ui | chat-server（8628，useChat 协议端点 + 纯 fetch SSE 页） |
| patterns | routing / parallel-loop |
| capstone | support（8629，ToolLoopAgent + FAQ RAG 工具 + 订单工具） |

### 验证

- `pnpm -r --no-bail typecheck`：19 个 workspace 项目全绿
- 14 个 demo 实测跑通（mcp/http 需先启动 mastra 组 8618 MCP server，前置命令见其 README）
- SSE 协议实测：8628 共 9 帧；8629 共 146 帧（lookupOrder + searchFaq 双工具各一轮、2 个 step、`data: [DONE]` 收尾）
