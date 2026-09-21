import { Agent } from '@mastra/core/agent';
import { Mastra } from '@mastra/core';
import { MCPClient } from '@mastra/mcp';

/**
 * MCP 客户端：连接本仓库 8618 端口的 saa-mcp-server（Streamable HTTP）。
 * 先启动 mastra-mcp-server（npx mastra dev），再运行本模块的 demo。
 *
 * listTools() 返回各 server 的全部工具，可直接注入 Agent 的 tools。
 */
export const saaClient = new MCPClient({
  id: 'saa-mcp-client',
  servers: {
    saaServer: {
      url: new URL('http://localhost:8618/mcp'),
    },
  },
});

export const remoteToolsAgent = new Agent({
  id: 'remote-tools-agent',
  name: 'Remote Tools Agent',
  instructions: `
    你是助手。你拥有来自远程 MCP server 的工具（天气/订单查询），
    需要时直接调用，回答简洁。
  `,
  model: 'deepseek/deepseek-chat',
});

export const mastra = new Mastra({
  agents: { remoteToolsAgent },
  server: { port: 8619 },
});
