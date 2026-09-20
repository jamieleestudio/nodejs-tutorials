# ⑤ 工作流 ★（mastra-workflows）

## 这一章解决什么

Mastra 招牌：createWorkflow + createStep 声明式编排，支持分支、并行、挂起恢复与错误降级。

## 模块清单

| 模块 | 端口 | 主题 | 运行 |
|---|---|---|---|
| [mastra-workflow-basics](./mastra-workflow-basics/README.md) | 8613 | 步骤链式编排 | `npx tsx src/demo.ts` |
| [mastra-workflow-branching](./mastra-workflow-branching/README.md) | 8614 | 分支路由 | `npx tsx src/demo.ts` |
| [mastra-workflow-suspend](./mastra-workflow-suspend/README.md) | 8615 | 挂起恢复（HITL） | `npx tsx src/demo.ts` |
| [mastra-workflow-parallel](./mastra-workflow-parallel/README.md) | 8616 | 并行 + 聚合 | `npx tsx src/demo.ts` |
| [mastra-workflow-error](./mastra-workflow-error/README.md) | 8617 | 错误降级 | `npx tsx src/demo.ts` |
