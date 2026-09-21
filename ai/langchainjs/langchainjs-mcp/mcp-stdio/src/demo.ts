import { MultiServerMCPClient } from '@langchain/mcp-adapters';

/**
 * MCP stdio 客户端：MultiServerMCPClient 启动子进程 MCP server
 * （npx @modelcontextprotocol/server-everything），列出其暴露的工具。
 * 首次运行 npx 会自动下载该包。
 */
const client = new MultiServerMCPClient({
  mcpServers: {
    everything: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-everything'],
    },
  },
});

async function main(): Promise<void> {
  const tools = await client.getTools();
  console.log(`发现 ${tools.length} 个 MCP 工具：`);
  for (const t of tools) {
    console.log(`- ${t.name}：${t.description?.slice(0, 60) ?? ''}`);
  }
  await client.close();
}

main();
