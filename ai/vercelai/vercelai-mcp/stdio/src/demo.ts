/**
 * AI SDK 7 MCP stdio：createMCPClient + StdioMCPTransport → 工具直接注入 generateText
 *
 * MCP 客户端已从主包拆到 @ai-sdk/mcp（v7）；stdio 传输在 @ai-sdk/mcp/mcp-stdio 子路径。
 * 服务端复用 langchainjs-mcp/mcp-stdio 的同款：npx @modelcontextprotocol/server-everything
 * （首次运行 npx 自动下载）。
 * 对照：langchainjs-mcp/mcp-stdio（MCPAdapter.listTools）。
 *
 * 运行：pnpm --filter vercelai-mcp-stdio demo
 */
import { generateText, stepCountIs } from 'ai';
import { createMCPClient } from '@ai-sdk/mcp';
import { StdioMCPTransport } from '@ai-sdk/mcp/mcp-stdio';
import { createChatModel } from 'vercelai-shared';

async function main(): Promise<void> {
  // ---- 1. 启动 stdio 子进程 server 并握手 ----
  const client = await createMCPClient({
    transport: new StdioMCPTransport({
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-everything'],
      stderr: 'ignore',
    }),
  });

  try {
    console.log('【1】已连接 server:', client.serverInfo.name, client.serverInfo.version);

    // ---- 2. tools()：把 MCP 工具表转成 generateText 可用的 ToolSet ----
    const tools = await client.tools();
    const names = Object.keys(tools);
    console.log(`【2】发现 ${names.length} 个工具:`, names.slice(0, 8).join(', '), names.length > 8 ? '…' : '');

    // ---- 3. 注入工具循环：模型自己挑工具，跨进程执行 ----
    const result = await generateText({
      model: createChatModel(),
      instructions: '你可以调用 MCP 工具。算术用 add 工具，复述用 echo 工具。',
      prompt: '帮我算 23 + 19，然后把算式和结果原样 echo 一遍。',
      tools,
      stopWhen: stepCountIs(10),
    });
    console.log('【3】agent 回答:', result.text);
  } finally {
    await client.close(); // 关闭子进程
  }
}

main().catch((error) => {
  console.error('demo 失败:', error);
  process.exitCode = 1;
});
