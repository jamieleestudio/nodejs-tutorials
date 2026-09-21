import { createAgent, modelCallLimitMiddleware } from 'langchain';
import { ChatOpenAI } from '@langchain/openai';
import { createChatModel } from 'langchainjs-shared';

/**
 * 内置中间件：modelCallLimit 限制模型调用次数（thread/run 两级）——
 * 对照 Java 侧 langchain4j 的 ModelCallLimitHook。
 * 官方还内置 pii/piiRedaction/summarization/hitl/toolCallLimit 等中间件。
 */
const agent = createAgent({
  model: new ChatOpenAI({
    model: 'deepseek-chat',
    apiKey: process.env.DEEPSEEK_API_KEY,
    configuration: { baseURL: 'https://api.deepseek.com' },
  }),
  middleware: [modelCallLimitMiddleware({ threadLimit: 5, exitBehavior: 'end' })],
});

async function main(): Promise<void> {
  const result = await agent.invoke({
    messages: [{ role: 'user', content: '用一句话介绍 Agent 中间件模式' }],
  });
  const last = result.messages[result.messages.length - 1];
  console.log('- 回答:', typeof last.content === 'string' ? last.content : JSON.stringify(last.content));
}

main();
