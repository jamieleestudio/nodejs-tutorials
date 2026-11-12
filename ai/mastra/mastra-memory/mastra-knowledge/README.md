# mastra-knowledge — Knowledge v2 页式知识库（1.82 新特性）

## 演示

```bash
cd ai/mastra
pnpm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
pnpm --filter nodejs-tutorials-ai-mastra-knowledge demo
```

## 演示内容

Mastra 1.82 引入的 **Knowledge v2**（实验性）：与「向量库 + RAG 管道」不同，
它是一个带**访问控制**的页式知识库——`scope`（`org:acme`）→ 页面树（`policies/refund`）→ 笔记，
天然贴合多租户 SaaS 的文档口径场景。

| 步骤 | 说明 |
|---|---|
| 声明 Knowledge | `scopes` 声明 scope 模式（`org:$orgId`）与访问规则（self → editor），`storage` 用 LibSQL 落盘 |
| 宿主写入 | `upsertPage({ scope, path, name, body })` 幂等写入页面（内容不变 → `unchanged`，不重复嵌入） |
| Agent 挂载 | Agent 配置 `knowledge` 实例 + `scopes: ['org:acme']`，自动获得 knowledge_search / knowledge_read / knowledge_page / knowledge_note 工具 |
| 运行检索 | Agent 先 knowledge_search 再 knowledge_read 作答；没配 vector/embedder 时为关键词检索 |

## 对应新特性

- `new Knowledge(config)`：`@mastra/core/knowledge`
- Agent 的 `knowledge`（实例或注册 key）与 `scopes`（静态列表 / 动态函数）选项
- 宿主 API：`upsertPage` / `addNote` / `removePage`；运行 API：`createTools()`、`readScopeFor()`、`explainAccess()`
- 配 `vector` + `embedder` 后检索自动升级为关键词 + 语义混合，写入即嵌入
