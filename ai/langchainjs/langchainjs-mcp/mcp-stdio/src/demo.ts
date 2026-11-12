import { MCPAdapter } from '@langchain/mcp-adapters';

/**
 * MCP stdio 客户端：MCPAdapter（2.0 新 API，取代 MultiServerMCPClient）启动子进程
 * MCP server（npx @modelcontextprotocol/server-everything），列出其暴露的工具。
 * 首次运行 npx 会自动下载该包。
 */
const adapter = new MCPAdapter({
  servers: {
    everything: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-everything'],
    },
  },
});

async function main(): Promise<void> {
  // 2.0：listTools() 返回扁平工具数组（工具名默认加 everything_ 前缀）；
  // listToolsets() 则按 server 名分组返回 Record<string, Tool[]>
  const tools = await adapter.listTools();
  console.log(`发现 ${tools.length} 个 MCP 工具：`);
  for (const t of tools) {
    console.log(`- ${t.name}：${t.description?.slice(0, 60) ?? ''}`);
  }
  await adapter.close();
}

main();
