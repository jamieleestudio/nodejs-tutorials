import { createAgent, piiRedactionMiddleware } from 'langchain';
import { ChatOpenAI } from '@langchain/openai';
import { createChatModel } from 'langchainjs-shared';

/**
 * PII 打码护栏：piiRedactionMiddleware（rules: 规则名 → 正则）在模型调用前
 * 把匹配内容替换为 [REDACTED_*] 标记（工具执行时自动还原原始值）——
 * 对照 Java 侧 langchain4j 的 InputGuardrail 手机号打码。
 */
const agent = createAgent({
  model: new ChatOpenAI({
    model: 'deepseek-chat',
    apiKey: process.env.DEEPSEEK_API_KEY,
    configuration: { baseURL: 'https://api.deepseek.com' },
  }),
  middleware: [
    piiRedactionMiddleware({
      rules: {
        phone: /1[3-9]\d{9}/g,
      },
    }),
  ],
});

async function main(): Promise<void> {
  const result = await agent.invoke({
    messages: [{ role: 'user', content: '我的手机号是 13812345678，帮我注册会员' }],
  });
  const last = result.messages[result.messages.length - 1];
  console.log('- 回答:', typeof last.content === 'string' ? last.content : JSON.stringify(last.content));
}

main();
