import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

/**
 * 自定义 stdio MCP server：演示 MCP elicitation（服务端在工具执行中途向客户端要输入）。
 * 客户端侧见 src/demo.ts（@langchain/mcp-adapters 2.0 的 onElicitation）。
 */
const server = new McpServer(
  { name: 'booking-server', version: '1.0.0' },
  { capabilities: { elicitation: {} } },
);

server.registerTool(
  'book_meeting_room',
  {
    title: '预订会议室',
    description: '预订公司会议室。执行前会通过 elicitation 向用户确认人数与楼层偏好。',
    inputSchema: { topic: z.string().describe('会议主题') },
  },
  async ({ topic }) => {
    // 经典 MCP elicitation：工具执行中向客户端发起 elicitation/create 请求
    const result = await server.elicitInput({
      message: `确认预订会议室（主题：${topic}）？请填写参会人数与楼层偏好。`,
      requestedSchema: {
        type: 'object',
        properties: {
          seats: { type: 'number', title: '参会人数', minimum: 1, maximum: 20 },
          floor: { type: 'string', title: '楼层偏好', enum: ['5F', '8F', '12F'] },
        },
        required: ['seats', 'floor'],
      },
    });
    if (result.action !== 'accept') {
      return { content: [{ type: 'text', text: '用户取消或拒绝了预订。' }] };
    }
    const { seats, floor } = result.content ?? {};
    return {
      content: [{ type: 'text', text: `已预订 ${floor} 会议室（${seats} 人），主题「${topic}」。` }],
    };
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
