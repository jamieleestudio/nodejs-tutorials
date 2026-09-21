# ③ 记忆（mastra-memory）

## 这一章解决什么

三层记忆：消息历史（lastMessages）、工作记忆（resource 级用户档案）、语义召回（向量检索历史）。

## 模块清单

| 模块 | 端口 | 主题 | 运行 |
|---|---|---|---|
| [mastra-memory-working](./mastra-memory-working/README.md) | 8607 | 工作记忆 | `npx tsx src/demo.ts` |
| [mastra-memory-recall](./mastra-memory-recall/README.md) | 8608 | 语义召回（需嵌入端点） | `npx tsx src/demo.ts` |
| [mastra-memory-persistence](./mastra-memory-persistence/README.md) | 8609 | 持久化（LibSQL 文件） | `npx tsx src/demo.ts write / read` |
