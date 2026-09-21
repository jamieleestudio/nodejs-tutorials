import { mastra } from './mastra/index.ts';

console.log(`
MCP 服务端已就绪（mastra dev 已自动挂载 HTTP transport）。

本模块注册的工具：
  - get-weather(city)
  - lookup-order(orderId)
  - agent: assistant

配合 mastra-mcp-client（8619）体验：
  cd ../mastra-mcp-client && npm run demo

也可以用任意 MCP 客户端（如 Claude Desktop）连接本服务的 MCP 端点。
`);

// 展示注册信息
console.log('已注册 MCP server: saa-mcp-server');
