import { createAgent, tool } from 'langchain';
import { ChatOpenAI } from '@langchain/openai';
import { z } from 'zod';
import { createChatModel } from 'langchainjs-shared';

/**
 * config 透传基础：invoke 时传 `{ configurable: { userId, role } }`，
 * 工具执行函数的第二个参数（ToolRunnableConfig）即可读取——
 * 用户身份**不经过 LLM**，走纯代码通道直达工具。
 *
 * 对照 Java 侧 Spring AI 的 ToolContext / langchain4j 的 memoryId。
 * 安全原则：身份绝不放 system prompt（可被注入/泄露）。
 */
const orderTool = tool(
  (input, config) => {
    const userId = config?.configurable?.userId ?? 'anonymous';
    const role = config?.configurable?.role ?? 'guest';
    // 真实场景：userId/role 用于查询当前用户的订单，而非让模型猜
    const orders: Record<string, string[]> = {
      'u-1001': ['订单 1001：已发货', '订单 1002：已签收'],
      'u-1002': ['订单 2001：待付款'],
    };
    const list = orders[userId] ?? [];
    return `当前用户 ${userId}（角色 ${role}）的订单：\n${list.join('\n') || '（无订单）'}\n查询条件：${input.keyword}`;
  },
  {
    name: 'list_my_orders',
    description: '查询当前登录用户自己的订单列表',
    schema: z.object({
      keyword: z.string().describe('订单关键词过滤，可为空字符串'),
    }),
  },
);

const agent = createAgent({
  model: new ChatOpenAI({
    model: 'deepseek-chat',
    apiKey: process.env.DEEPSEEK_API_KEY,
    configuration: { baseURL: 'https://api.deepseek.com' },
  }),
  tools: [orderTool],
});

async function main(): Promise<void> {
  // 用户身份走 configurable，直达工具，LLM 全程不可见
  const result = await agent.invoke(
    { messages: [{ role: 'user', content: '帮我看看我有哪些订单' }] },
    { configurable: { userId: 'u-1001', role: 'member' } },
  );
  const last = result.messages[result.messages.length - 1];
  console.log('- 回答:', typeof last.content === 'string' ? last.content : JSON.stringify(last.content));
}

main();
