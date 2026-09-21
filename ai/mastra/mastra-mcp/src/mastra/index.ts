import { Mastra } from '@mastra/core';
import { assistant, saaMcpServer } from './mcp-server/definition.ts';
import { remoteToolsAgent } from './mcp-client/definition.ts';

export const mastra = new Mastra({
  agents: { assistant, remoteToolsAgent },
  // MCPServer 由 mastra dev 自动挂载 HTTP transport（端口即本分类端口）
  mcpServers: { saaMcpServer },
  server: { port: 8605 },
});
