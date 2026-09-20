# ② 工具（mastra-tools）

## 这一章解决什么

createTool（Zod schema）+ 子 Agent 委派 + 敏感工具人工审批（requireApproval）。

## 模块清单

| 模块 | 端口 | 主题 | 运行 |
|---|---|---|---|
| [mastra-tools-basics](./mastra-tools-basics/README.md) | 8604 | createTool 工具调用 | `npx tsx src/demo.ts` |
| [mastra-subagents](./mastra-subagents/README.md) | 8605 | 子 Agent 委派 | `npx tsx src/demo.ts` |
| [mastra-tool-approval](./mastra-tool-approval/README.md) | 8606 | 工具审批 HITL | `npx tsx src/demo.ts` |
