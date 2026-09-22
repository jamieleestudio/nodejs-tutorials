# LangChain.js 教程

用 **Node.js 24 + TypeScript + LangChain 1.5 / LangGraph 1.4** 演示 LangChain.js 的核心能力：
ChatModel、AiServices 式声明（createAgent）、LCEL 链、工具、记忆、RAG（本地 transformers.js 嵌入）、
Guardrails 中间件、LangGraph 工作流（StateGraph / 分支 / 循环 / 并行 / 人工介入 / 持久化）、MCP 与编排模式。

> LangChain.js 与 LangChain4j 是同一理念的 Java/TS 双生实现：声明式接口、工具调用、RAG、记忆。
> 本组与 Java 侧 `ai/langchain4j` 组 **10 分类逐组对照**，模块一一对应，可跨语言对照学习。
> 模型统一 DeepSeek（`@langchain/openai` 的 OpenAI 兼容 baseUrl）；RAG 嵌入用
> `@huggingface/transformers` 本地 ONNX（Xenova/bge-small-zh-v1.5），零 API key。

## 运行方式

**分类即工程**：pnpm workspace（`pnpm-workspace.yaml`）聚合 shared + 9 个分类工程，
每个分类是一个独立 npm 包，模块以 `src/demos/<模块>.ts` 演示脚本区分。

```bash
# 一次安装全部模块（pnpm 的内容寻址仓库等价 Maven ~/.m2，全组共享一份物理依赖）
cd ai/langchainjs
pnpm install

cp .env.example .env          # 填入 DEEPSEEK_API_KEY

# 单模块运行
pnpm --filter langchainjs-chat-models demo

# 全部 demo 也可进入各分类目录 npx tsx src/demos/<模块>.ts 运行
```

## 与 Java 侧 LangChain4j 组的对照

| 概念 | LangChain.js | LangChain4j（Java） |
|---|---|---|
| 聊天模型 | `ChatOpenAI` + baseUrl | `OpenAiChatModel.builder()` |
| 声明式服务 | `createAgent`（1.x 新架构） | `AiServices.builder()` |
| 工作流 | `@langchain/langgraph` StateGraph | SAA 的 StateGraph / LC4j agentic |
| 人工介入 | `interrupt()` + `Command.resume` | `interruptBefore` + `resume` |
| 并行 | `Send` API / Promise.all | `parallelBuilder` / parallel edges |
| 记忆 | InMemoryChatMessageHistory + thread | ChatMemory + memoryId |
| MCP | `@langchain/mcp-adapters` | `langchain4j-mcp` |

## 分类与模块（31 个 demo / 10 分类 + shared，全部编译通过，核心链路已运行验证）

### ① [basics](langchainjs-basics/README.md) — 5 个 demo

| 模块 | 主题 |
|---|---|
| [chat-models](langchainjs-basics/chat-models/README.md) | ChatOpenAI + 消息类型 |
| [prompt-templates](langchainjs-basics/prompt-templates/README.md) | ChatPromptTemplate 插值 |
| [output-parsers](langchainjs-basics/output-parsers/README.md) | StringOutputParser + zod 结构化 |
| [chains](langchainjs-basics/chains/README.md) | LCEL 链（pipe / RunnableLambda / Passthrough） |
| [streaming](langchainjs-basics/streaming/README.md) | 流式输出 |

### ② [agents](langchainjs-agents/README.md) — 3 个 demo

| 模块 | 主题 |
|---|---|
| [agent-basics](langchainjs-agents/agent-basics/README.md) | createAgent + tools |
| [agent-middleware](langchainjs-agents/agent-middleware/README.md) | 中间件（模型调用前后拦截） |
| [agent-structured-output](langchainjs-agents/agent-structured-output/README.md) | responseFormat 结构化 |

### ③ [memory](langchainjs-memory/README.md) — 2 个 demo

| 模块 | 主题 |
|---|---|
| [memory-history](langchainjs-memory/memory-history/README.md) | RunnableWithMessageHistory 会话历史 |
| [memory-persistence](langchainjs-memory/memory-persistence/README.md) | 自定义 FileChatMessageHistory 落盘 |

### ④ [RAG ★](langchainjs-rag/README.md) — 4 个 demo

| 模块 | 主题 |
|---|---|
| [rag-embeddings-local](langchainjs-rag/rag-embeddings-local/README.md) | 本地 BGE-zh 嵌入 + 余弦相似度 |
| [rag-vectorstore](langchainjs-rag/rag-vectorstore/README.md) | MemoryVectorStore 增查 |
| [rag-basics](langchainjs-rag/rag-basics/README.md) | 检索 + LLM 问答 |
| [rag-advanced](langchainjs-rag/rag-advanced/README.md) | 双源路由检索 |

### ⑤ [workflows ★（LangGraph）](langchainjs-workflows/README.md) — 6 个 demo

| 模块 | 主题 |
|---|---|
| [state-graph](langchainjs-workflows/state-graph/README.md) | StateGraph 基础 |
| [branching](langchainjs-workflows/branching/README.md) | addConditionalEdges 分支 |
| [cycle](langchainjs-workflows/cycle/README.md) | 循环 + 轮次上限 |
| [parallel-send](langchainjs-workflows/parallel-send/README.md) | Send API map-reduce |
| [interrupt](langchainjs-workflows/interrupt/README.md) | interrupt + Command.resume（HITL） |
| [persistence](langchainjs-workflows/persistence/README.md) | MemorySaver + thread_id |

### ⑥ [MCP](langchainjs-mcp/README.md) — 2 个 demo

| 模块 | 主题 |
|---|---|
| [mcp-stdio](langchainjs-mcp/mcp-stdio/README.md) | MCP stdio 客户端 |
| [mcp-agent](langchainjs-mcp/mcp-agent/README.md) | MCP 工具注入 Agent |

### ⑦ [patterns](langchainjs-patterns/README.md) — 3 个 demo

| 模块 | 模式 |
|---|---|
| [pattern-routing](langchainjs-patterns/pattern-routing/README.md) | 路由分发 |
| [pattern-parallel](langchainjs-patterns/pattern-parallel/README.md) | 并发评审 |
| [pattern-supervisor](langchainjs-patterns/pattern-supervisor/README.md) | 主管循环编排 |

### ⑧ capstone — 1 个 demo

| 模块 | 主题 |
|---|---|
| [capstone-app](langchainjs-capstone/capstone-app/README.md) | 智能客服综合（FAQ + 订单工具 + agent） |

### ⑨ [context ★](langchainjs-context/README.md) — 4 个 demo

| 模块 | 主题 |
|---|---|
| [context-config](langchainjs-context/context-config/README.md) | configurable 透传用户身份到工具 |
| [context-factory](langchainjs-context/context-factory/README.md) | 工厂闭包按请求构建带身份工具 |
| [context-rbac](langchainjs-context/context-rbac/README.md) | wrapToolCall RBAC 工具权限拦截 |
| [context-langgraph](langchainjs-context/context-langgraph/README.md) | LangGraph 节点读 configurable |

## 环境变量

| 变量 | 用途 |
|---|---|
| `DEEPSEEK_API_KEY` | 全部 demo 的聊天/推理模型 |
| `HF_ENDPOINT`（可选） | transformers.js 下载模型的镜像（默认 hf-mirror.com 已内置） |

## 技术栈

- Node.js 24 + TypeScript 5.6 + ESM + tsx
- langchain 1.5.11（createAgent 新架构）、@langchain/langgraph 1.4.16、@langchain/mcp-adapters 1.1.4
- @huggingface/transformers 4.3（本地嵌入）
- DeepSeek API（OpenAI 兼容）
