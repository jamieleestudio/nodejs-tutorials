import { createAgent, tool } from 'langchain';
import { ChatOpenAI } from '@langchain/openai';
import { z } from 'zod';
import { createChatModel } from 'langchainjs-shared';

/**
 * createAgent 基础：Agent + tools（模型自主决策调用）。
 * 对照 Java 侧 langchain4j-tools-basics 的 @Tool + AiServices.tools。
 */
const weatherTool = tool(
  (input) => {
    return `${input.city}：晴，26°C`;
  },
  {
    name: 'get_weather',
    description: '查询指定城市的当前天气（模拟数据）',
    schema: z.object({
      city: z.string().describe('城市名，如：杭州'),
    }),
  },
);

const calculatorTool = tool(
  (input) => String(input.a * input.b),
  {
    name: 'multiply',
    description: '计算两个数的乘积',
    schema: z.object({
      a: z.number().describe('第一个数'),
      b: z.number().describe('第二个数'),
    }),
  },
);

const agent = createAgent({
  model: new ChatOpenAI({
    model: 'deepseek-chat',
    apiKey: process.env.DEEPSEEK_API_KEY,
    configuration: { baseURL: 'https://api.deepseek.com' },
  }),
  tools: [weatherTool, calculatorTool],
});

async function main(): Promise<void> {
  const result = await agent.invoke({
    messages: [{ role: 'user', content: '杭州今天天气怎么样？另外帮我算一下 256 乘以 4' }],
  });
  const last = result.messages[result.messages.length - 1];
  console.log('- 回答:', typeof last.content === 'string' ? last.content : JSON.stringify(last.content));
  console.log('- 消息总数:', result.messages.length);
}

main();
