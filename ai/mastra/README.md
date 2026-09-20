# Mastra 教程

用 **Node.js 24 + TypeScript + Mastra 1.67** 演示 Mastra 的核心能力：
Agent、工具、工作流（Workflows）、记忆、RAG、MCP 与编排模式。

> Mastra 是 TypeScript 优先的 AI 应用框架，构建在 Vercel AI SDK 之上。
> model router 原生支持 DeepSeek：Agent 的 `model` 写成 `'deepseek/deepseek-chat'`
> 字符串 + `DEEPSEEK_API_KEY` 环境变量即可，无需手写 base-url。

## 运行方式

Mastra 组通过**根 package.json 的 npm workspaces 聚合**（等价 Java 侧的 Maven 聚合 pom）：
每个叶子模块是独立 npm 包（自含 package.json 与端口），根目录一条命令即可解析/构建/运行全部。

```bash
# 【等价 mvn package】根目录解析全仓依赖（26 个模块一次装齐）
npm install

# 【等价 mvn compile】全量类型检查
npm run typecheck --workspaces --if-present

# 【等价 mvn -pl :module】单模块运行
npm run demo -w nodejs-tutorials-ai-mastra-chat       # 程序化演示
npm run dev  -w nodejs-tutorials-ai-mastra-chat       # dev server + Studio（端口见模块）

# 也可以进入模块目录独立运行（效果相同）
cd ai/mastra/mastra-basics/mastra-chat
cp .env.example .env        # 填入 DEEPSEEK_API_KEY
npx mastra dev
```

`mastra dev` 会同时提供 **Studio 调试界面**（浏览器打开模块端口）与 **HTTP API**
（`POST /api/agents/{agentId}/generate` 等），README 端口表中标注了各模块端口。

### Maven ↔ npm 对照

| 你想做什么 | Maven（java-tutorials） | npm（本仓库） |
|---|---|---|
| 解析全仓依赖 | `mvn package` | `npm install`（根目录） |
| 全量编译 | `mvn compile` | `npm run typecheck --workspaces --if-present` |
| 单模块运行 | `mvn -pl :spring-ai-chat spring-boot:run` | `npm run dev -w nodejs-tutorials-ai-mastra-chat` |
| 新增叶子模块 | 建目录 + pom，挂进 `<modules>` | 建目录 + package.json，分类 glob 自动命中 |

## 与 Java 侧三个 AI 组的定位差异

| 维度 | Mastra | Spring AI / SAA | Embabel | AgentScope |
|---|---|---|---|---|
| 语言生态 | TypeScript / Node.js | Java | Java | Java |
| 编排 | Workflow（步骤/分支/挂起恢复） | SAA: Graph 图编排 | GOAP 规划器 | ReAct + Middleware |
| 记忆 | working memory + semantic recall | ChatMemory / checkpoint | Process 状态 | AgentStateStore |
| HITL | 工具级 `requireApproval` + workflow `suspend` | Graph `interruptBefore` | HITL Action | Permission/ASK |
| 调试 | Studio（自带 UI） | curl / 日志 | curl / 日志 | curl / 日志 |

## 分类与模块（26 模块 / 9 分类，全部 typecheck 通过，核心链路已运行验证）

### ① [基础（mastra-basics）](mastra-basics/README.md) — 端口 8600-8603

| 模块 | 端口 | 主题 |
|---|---|---|
| [mastra-chat](mastra-basics/mastra-chat/README.md) | 8600 | 最小聊天 Agent（generate） |
| [mastra-streaming](mastra-basics/mastra-streaming/README.md) | 8601 | 流式输出（textStream / fullStream） |
| [mastra-structured-output](mastra-basics/mastra-structured-output/README.md) | 8602 | 结构化输出（structuredOutput + Zod） |
| [mastra-dynamic-model](mastra-basics/mastra-dynamic-model/README.md) | 8603 | 动态模型（RequestContext 切换 chat/reasoner） |

### ② [工具（mastra-tools）](mastra-tools/README.md) — 端口 8604-8606

| 模块 | 端口 | 主题 |
|---|---|---|
| [mastra-tools-basics](mastra-tools/mastra-tools-basics/README.md) | 8604 | createTool + Zod schema |
| [mastra-subagents](mastra-tools/mastra-subagents/README.md) | 8605 | 子 Agent 委派（agents 选项） |
| [mastra-tool-approval](mastra-tools/mastra-tool-approval/README.md) | 8606 | 工具审批 HITL（requireApproval） |

### ③ [记忆（mastra-memory）](mastra-memory/README.md) — 端口 8607-8609

| 模块 | 端口 | 主题 |
|---|---|---|
| [mastra-memory-working](mastra-memory/mastra-memory-working/README.md) | 8607 | 工作记忆（resource 级用户档案） |
| [mastra-memory-recall](mastra-memory/mastra-memory-recall/README.md) | 8608 | 语义召回（向量检索历史） |
| [mastra-memory-persistence](mastra-memory/mastra-memory-persistence/README.md) | 8609 | 记忆持久化（LibSQLStore 文件落盘） |

### ④ [RAG（mastra-rag）](mastra-rag/README.md) — 端口 8610-8612

| 模块 | 端口 | 主题 |
|---|---|---|
| [mastra-rag-chunking](mastra-rag/mastra-rag-chunking/README.md) | 8610 | 文档分块（MDocument 策略） |
| [mastra-rag-vector-store](mastra-rag/mastra-rag-vector-store/README.md) | 8611 | 向量存储（LibSQLVector） |
| [mastra-rag-pipeline](mastra-rag/mastra-rag-pipeline/README.md) | 8612 | RAG 管道（createVectorQueryTool） |

### ⑤ [工作流 ★（mastra-workflows）](mastra-workflows/README.md) — 端口 8613-8617

| 模块 | 端口 | 主题 |
|---|---|---|
| [mastra-workflow-basics](mastra-workflows/mastra-workflow-basics/README.md) | 8613 | 步骤链式编排（createWorkflow + createStep） |
| [mastra-workflow-branching](mastra-workflows/mastra-workflow-branching/README.md) | 8614 | 分支路由（branch） |
| [mastra-workflow-suspend](mastra-workflows/mastra-workflow-suspend/README.md) | 8615 | 挂起恢复（suspend + resume） |
| [mastra-workflow-parallel](mastra-workflows/mastra-workflow-parallel/README.md) | 8616 | 并行执行（parallel + 聚合） |
| [mastra-workflow-error](mastra-workflows/mastra-workflow-error/README.md) | 8617 | 错误处理（降级 + fallback 分支） |

### ⑥ [MCP（mastra-mcp）](mastra-mcp/README.md) — 端口 8618-8619

| 模块 | 端口 | 主题 |
|---|---|---|
| [mastra-mcp-server](mastra-mcp/mastra-mcp-server/README.md) | 8618 | MCP 服务端（MCPServer 暴露工具） |
| [mastra-mcp-client](mastra-mcp/mastra-mcp-client/README.md) | 8619 | MCP 客户端（MCPClient 接入） |

### ⑦ 评估（mastra-evals） — 端口 8620

| 模块 | 端口 | 主题 |
|---|---|---|
| [mastra-evals](mastra-evals/mastra-evals/README.md) | 8620 | Scorer 评估（模型评分 + 规则断言） |

### ⑧ [编排模式 ★（mastra-patterns）](mastra-patterns/README.md) — 端口 8621-8624

与其他组 patterns **1:1 对照**，用 Workflow 实现路由 / 并行 / 编排者-工人 / 主管：

| 模块 | 端口 | 模式 |
|---|---|---|
| [mastra-pattern-routing](mastra-patterns/mastra-pattern-routing/README.md) | 8621 | 路由分类 → 分发专家 |
| [mastra-pattern-parallel](mastra-patterns/mastra-pattern-parallel/README.md) | 8622 | 并行评审 → 汇总 |
| [mastra-pattern-orchestrator](mastra-patterns/mastra-pattern-orchestrator/README.md) | 8623 | 编排者-工人（拆解 → 并行 → 汇总） |
| [mastra-pattern-supervisor](mastra-patterns/mastra-pattern-supervisor/README.md) | 8624 | 主管模式（subagents 委派） |

### ⑨ 综合（mastra-capstone） — 端口 8625

| 模块 | 端口 | 主题 |
|---|---|---|
| [mastra-capstone-app](mastra-capstone/mastra-capstone-app/README.md) | 8625 | 智能客服（RAG + 记忆 + 工具审批） |

## 环境变量

| 变量 | 用途 | 必需性 |
|---|---|---|
| `DEEPSEEK_API_KEY` | 全部模块的聊天/推理模型（deepseek/*） | 必需 |
| `DASHSCOPE_API_KEY` | 嵌入模型（memory-recall / rag / capstone） | 对应模块必需 |
| `EMBEDDING_BASE_URL` / `EMBEDDING_MODEL` | 换任意 OpenAI 兼容嵌入服务 | 可选 |

## 技术栈

- Node.js >= 22.13（本机 24）
- TypeScript 5.6 + ESM + tsx
- Mastra：@mastra/core 1.67、mastra CLI 1.30、@mastra/memory 1.30、@mastra/libsql 1.23、@mastra/rag 2.6、@mastra/mcp 1.18、@mastra/evals 1.10
- DeepSeek（model router `deepseek/*`）；嵌入走 DashScope 兼容模式（可选）
