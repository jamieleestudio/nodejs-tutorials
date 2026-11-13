/**
 * AI SDK 7 MCP Streamable HTTP：跨组联动——直连 mastra 组 8618 端口的 MCP server
 *
 * 前置：先启动 mastra 组的 MCP server
 *   cd ai/mastra && pnpm --filter nodejs-tutorials-ai-mastra-mcp-server dev
 * 它通过 Mastra MCPServer 把 get-weather / lookup-order 两个工具暴露在 http://localhost:8618/mcp
 * 对照：langchainjs-mcp/mcp-agent（同样的跨组消费方式）。
 *
 * 运行：pnpm --filter vercelai-mcp-http demo
 */
import { generateText, stepCountIs } from 'ai';
import { createMCPClient } from '@ai-sdk/mcp';
import { createChatModel } from 'vercelai-shared';

const SERVER_URL = 'http://localhost:8618/mcp';

async function main(): Promise<void> {
  // ---- 1. HTTP 传输：transport 直接给 { type: 'http', url }，无需实例化类 ----
  const client = await createMCPClient({
    transport: { type: 'http', url: SERVER_URL },
  });

  try {
    console.log('【1】已连接:', client.serverInfo.name, client.serverInfo.version);

    // ---- 2. 原始 RPC 视角：listTools / callTool（不经模型，程序直调）----
    const { tools } = await client.listTools();
    console.log('【2】server 工具表:', tools.map((t) => t.name).join(', '));
    const weather = await client.callTool({ name: 'get-weather', arguments: { city: '杭州' } });
    console.log('    callTool(get-weather 杭州):', JSON.stringify(weather.content));

    // ---- 3. agent 视角：tools() 注入 generateText，模型自主决定调哪个 ----
    const mcpTools = await client.tools();
    const result = await generateText({
      model: createChatModel(),
      instructions: '你是生活助手，需要天气/订单信息时用工具查询。',
      prompt: '杭州今天天气怎么样？顺便查下订单 1001 到哪了。',
      tools: mcpTools,
      stopWhen: stepCountIs(10),
    });
    console.log('【3】agent 回答:', result.text);
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error('demo 失败:', error);
  process.exitCode = 1;
});
