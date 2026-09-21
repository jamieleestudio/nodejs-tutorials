import { createAgent } from 'langchain';
import { ChatOpenAI } from '@langchain/openai';
import { z } from 'zod';
import { createChatModel } from 'langchainjs-shared';

/**
 * 结构化输出：createAgent 的 responseFormat 用 zod schema
 * 约束最终回答为强类型对象 —— 对照 Java 侧结构化输出模块。
 */
const agent = createAgent({
  model: new ChatOpenAI({
    model: 'deepseek-chat',
    apiKey: process.env.DEEPSEEK_API_KEY,
    configuration: { baseURL: 'https://api.deepseek.com' },
  }),
  responseFormat: z.object({
    title: z.string().describe('电影名'),
    year: z.number().describe('上映年份'),
    director: z.string().describe('导演'),
  }),
});

async function main(): Promise<void> {
  const result = await agent.invoke({
    messages: [{ role: 'user', content: '介绍电影《肖申克的救赎》' }],
  });
  console.log('- 结构化结果:', JSON.stringify(result.structuredResponse, null, 2));
}

main();
