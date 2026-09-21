import { ChatOpenAI } from '@langchain/openai';
import { createChatModel } from 'langchainjs-shared';

/**
 * 并行模式：两位专家 Promise.all 并发 + 主评汇总 ——
 * 对照 Java 侧 parallel edges / Mastra parallel / LangGraph Send。
 */
const model = createChatModel();

async function review(persona: string, input: string): Promise<string> {
  const r = await model.invoke(`（${persona}）一句话点评：${input}`);
  return String(r.content);
}

async function main(): Promise<void> {
  const input = '给公司内部知识库加一个 AI 问答机器人';

  const started = Date.now();
  const [tech, biz, ux] = await Promise.all([
    review('技术可行性评审', input),
    review('商业价值评审', input),
    review('用户体验评审', input),
  ]);
  console.log('- 并发耗时:', Date.now() - started, 'ms');

  const verdict = await model.invoke(
    `综合三位评审给出最终结论（两句话以内）：\n技术：${tech}\n业务：${biz}\n体验：${ux}`,
  );

  console.log('[技术]', tech);
  console.log('[业务]', biz);
  console.log('[体验]', ux);
  console.log('[结论]', String(verdict.content));
}

main();
