import { Agent } from '@mastra/core/agent';
import { createTool } from '@mastra/core/tools';
import { Mastra } from '@mastra/core';
import { MCPServer } from '@mastra/mcp';
import { z } from 'zod';

const weatherTool = createTool({
  id: 'get-weather',
  description: '查询指定城市的当前天气（模拟数据）',
  inputSchema: z.object({
    city: z.string().describe('城市名，如：杭州'),
  }),
  outputSchema: z.object({
    city: z.string(),
    weather: z.string(),
  }),
  execute: async ({ city }) => {
    const table: Record<string, string> = {
      杭州: '晴，26°C',
      北京: '多云，21°C',
      上海: '小雨，24°C',
    };
    return { city, weather: table[city] ?? `${city}：暂无数据` };
  },
});

const orderTool = createTool({
  id: 'lookup-order',
  description: '按订单号查询订单状态（模拟数据）',
  inputSchema: z.object({
    orderId: z.string().describe('订单号，如 1001'),
  }),
  outputSchema: z.object({
    status: z.string(),
  }),
  execute: async ({ orderId }) => {
    const orders: Record<string, string> = {
      '1001': '已发货，预计明日达',
      '1002': '已签收',
    };
    return { status: orders[orderId] ?? `订单 ${orderId} 不存在` };
  },
});

export const assistant = new Agent({
  id: 'assistant',
  name: 'Assistant',
  instructions: '你是助手，需要天气与订单信息时调用工具。',
  model: 'deepseek/deepseek-chat',
  tools: { weatherTool, orderTool },
});

// MCPServer：把 Mastra 的 agents/tools/workflows 暴露为标准 MCP 服务，
// 任何 MCP 客户端（Claude Desktop、其他 Mastra 应用等）都能发现并调用。
export const saaMcpServer = new MCPServer({
  id: 'saa-mcp-server',
  name: 'SAA MCP Server',
  version: '1.0.0',
  tools: { weatherTool, orderTool },
  agents: { assistant },
});

