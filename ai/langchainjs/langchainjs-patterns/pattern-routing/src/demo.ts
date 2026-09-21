import { createAgent } from 'langchain';
import { ChatOpenAI } from '@langchain/openai';
import { z } from 'zod';
import { createChatModel } from 'langchainjs-shared';

/**
 * 路由模式：createAgent + responseFormat 分类，再按类名分发专家（条件分发）。
 * 对照 Java 侧 langchain4j-pattern-routing（conditionalBuilder）。
 */
const routeSchema = z.object({
  lane: z.enum(['billing', 'technical', 'general']),
});

const model = new ChatOpenAI({
  model: 'deepseek-chat',
  apiKey: process.env.DEEPSEEK_API_KEY,
  configuration: { baseURL: 'https://api.deepseek.com' },
});

const router = createAgent({
  model,
  responseFormat: routeSchema,
});

const personas: Record<string, string> = {
  billing: '账单专家，谨慎对待退款承诺',
  technical: '技术支持专家，给出排查步骤',
  general: '通用客服，礼貌简洁',
};

async function handle(lane: string, request: string): Promise<string> {
  const persona = personas[lane] ?? personas.general;
  const expert = createAgent({
    model,
    prompt: `${persona}。回答简洁。`,
  });
  const result = await expert.invoke({
    messages: [{ role: 'user', content: request }],
  });
  const last = result.messages[result.messages.length - 1];
  return String(last.content);
}

async function main(): Promise<void> {
  const request = '我上个月被重复扣了一次会员费，请处理一下';
  const r = await router.invoke({
    messages: [{ role: 'user', content: request }],
  });
  const lane = (r.structuredResponse as { lane: string }).lane;
  console.log('[lane]', lane);
  console.log('[answer]', await handle(lane, request));
}

main();
