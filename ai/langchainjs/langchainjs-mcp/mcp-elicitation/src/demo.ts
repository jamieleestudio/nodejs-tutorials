import { fileURLToPath } from 'node:url';
import { MCPAdapter } from '@langchain/mcp-adapters';
import type { MCPElicitationHandler } from '@langchain/mcp-adapters';
import { createAgent } from 'langchain';
import type { ToolMessage } from '@langchain/core/messages';
import { createChatModel } from 'langchainjs-shared';

/**
 * MCP elicitation 客户端（mcp-adapters 2.0 新能力）：
 * 服务端工具执行中途调用 elicitation/create 向客户端要输入，
 * 连接级 onElicitation 处理器代答（生产环境应渲染表单/发审批流）。
 *
 * 新版进阶玩法：连接配 `elicitation: true` 且 server 以“input_required 工具结果”
 * 请求输入时，适配器会把问题转成 LangGraph interrupt（配 checkpointer 挂起），
 * 用 createMCPElicitationResume() 构造恢复值续跑。
 */
const adapter = new MCPAdapter({
  servers: {
    booking: {
      command: 'node',
      args: [fileURLToPath(new URL('./server.mjs', import.meta.url))],
      // mcp-adapters 2.0：onElicitation 只在 mode: 'legacy' 连接上可用
      // （该模式下客户端以 legacy 版本协商声明 elicitation capability 并安装 handler）
      mode: 'legacy',
      // 显式标注 MCPElicitationHandler：参数获得类型推断，action 字面量也被收窄
      onElicitation: (async (request, context) => {
        console.log(`[elicitation] server=${context.server}`);
        console.log(`[elicitation] 提问：${request.message}`);
        // request.requestedSchema 描述了表单字段；这里直接代填，模拟人类确认
        return { action: 'accept', content: { seats: 6, floor: '8F' } };
      }) satisfies MCPElicitationHandler,
    },
  },
});

async function main(): Promise<void> {
  // 2.0 API：listTools() 返回扁平工具数组，工具名默认加 `<serverName>_` 前缀
  const tools = await adapter.listTools();
  console.log(`- 已发现 MCP 工具: ${tools.map((t) => t.name).join(', ')}`);

  const agent = createAgent({ model: createChatModel(), tools });
  const result = await agent.invoke({
    messages: [{ role: 'user', content: '帮我订一间会议室，主题是「版本回顾会」' }],
  });

  for (const m of result.messages) {
    if ((m as ToolMessage).getType?.() === 'tool') {
      console.log(`- 工具结果: ${typeof m.content === 'string' ? m.content : JSON.stringify(m.content)}`);
    }
  }
  const last = result.messages[result.messages.length - 1];
  console.log('- 回答:', typeof last.content === 'string' ? last.content : JSON.stringify(last.content));
  await adapter.close();
}

main();
