import { createAgent, tool } from 'langchain';
import { ChatOpenAI } from '@langchain/openai';
import { MultiServerMCPClient } from '@langchain/mcp-adapters';
import { z } from 'zod';
import { createChatModel } from 'langchainjs-shared';

/**
 * MCP 工具 + Agent：把 MCP server 的远程工具与本地工具同时注入 Agent。
 * 对照 Java 侧 langchain4j-mcp-ai-service。
 */
const localEcho = tool(
  (input) => `本地回显：${input.text}`,
  {
    name: 'local_echo',
    description: '本地回显工具',
    schema: z.object({ text: z.string() }),
  },
);

const agent = createAgent({
  model: new ChatOpenAI({
    model: 'deepseek-chat',
    apiKey: process.env.DEEPSEEK_API_KEY,
    configuration: { baseURL: 'https://api.deepseek.com' },
  }),
  tools: [localEcho],
});

async function main(): Promise<void> {
  // 运行期动态连接 MCP server 并把远程工具挂到 agent 上
  const client = new MultiServerMCPClient({
    mcpServers: {
      everything: {
        command: 'npx',
        args: ['-y', '@modelcontextprotocol/server-everything'],
      },
    },
  });
  const mcpTools = await client.getTools();
  agent.tools = [...agent.tools, ...mcpTools];
  console.log(`- 已挂载 ${mcpTools.length} 个远程 MCP 工具`);

  const result = await agent.invoke({
    messages: [{ role: 'user', content: '用 local_echo 工具回显一句话：MCP 集成成功' }],
  });
  const last = result.messages[result.messages.length - 1];
  console.log('- 回答:', typeof last.content === 'string' ? last.content : JSON.stringify(last.content));
  await client.close();
}

main();
