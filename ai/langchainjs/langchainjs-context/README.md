# ⑩ 上下文透传 ★（4 个 demo）

## 这一章解决什么

把当前用户、角色、租户等请求级上下文透传到工具与服务 —— 身份走代码通道，
绝不放 system prompt 让 LLM 自行携带（可被注入/泄露）。
对照 Java 侧 Spring AI 的 ToolContext。

## 模块清单

| 模块 | 主题 |
|---|---|
| [context-config](./context-config/README.md) | invoke configurable → 工具内读取 |
| [context-factory](./context-factory/README.md) | 工厂闭包按请求构建带身份工具 |
| [context-rbac](./context-rbac/README.md) | wrapToolCall RBAC 工具权限拦截 |
| [context-langgraph](./context-langgraph/README.md) | LangGraph 节点/工具读 configurable |
