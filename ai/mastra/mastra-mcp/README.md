# ⑥ MCP（mastra-mcp）

## 这一章解决什么

MCPServer 把 Mastra 工具/Agent 暴露为标准 MCP 服务；MCPClient 发现并调用远程工具；
MCP Tasks（SEP-2663）把慢工具调用变成任务。

## 模块清单

| 模块 | 端口 | 主题 | 运行 |
|---|---|---|---|
| [mastra-mcp-server](./mastra-mcp-server/README.md) | 8618 | MCP 服务端 | `npx mastra dev` |
| [mastra-mcp-client](./mastra-mcp-client/README.md) | 8619 | MCP 客户端 | `npx tsx src/demo.ts` |
| [mastra-mcp-tasks](./mastra-mcp-tasks/README.md) | 8626 | MCP Tasks 长时任务（1.81 新特性） | `npx mastra dev` + `npx tsx src/demo.ts` |
