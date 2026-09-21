import { Agent } from '@mastra/core/agent';
import { createTool } from '@mastra/core/tools';
import { Mastra } from '@mastra/core';
import { z } from 'zod';

// 工具必须用 createTool() 定义（普通对象会静默失效）：
// id + description + inputSchema(Zod) + execute(inputData, context)
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
      杭州: '晴，26°C，东南风 3 级',
      北京: '多云，21°C，微风',
      上海: '小雨，24°C，湿度 85%',
    };
    return { city, weather: table[city] ?? `${city}：暂无模拟数据（示例仅支持 杭州/北京/上海）` };
  },
});

const calculatorTool = createTool({
  id: 'calculator',
  description: '计算两个数的四则运算',
  inputSchema: z.object({
    a: z.number().describe('第一个数'),
    b: z.number().describe('第二个数'),
    op: z.enum(['+', '-', '*', '/']).describe('运算符'),
  }),
  outputSchema: z.object({
    result: z.number(),
  }),
  execute: async ({ a, b, op }) => {
    const result = op === '+' ? a + b : op === '-' ? a - b : op === '*' ? a * b : a / b;
    return { result };
  },
});

export const toolAgent = new Agent({
  id: 'tool-agent',
  name: 'Tool Agent',
  instructions: `
    你是一个助手。天气和数学计算必须调用对应工具，不要凭空编造。
    回答中带上工具返回的数据。
  `,
  model: 'deepseek/deepseek-chat',
  tools: { weatherTool, calculatorTool },
});

