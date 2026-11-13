/**
 * AI SDK 7 基础：generateText / streamText
 *
 * 核心抽象：业务代码只依赖 LanguageModel 接口，换供应商只换"造模型"那一行。
 * 对照：langchainjs-basics/chat-models（ChatOpenAI + invoke/stream）。
 *
 * 运行：pnpm --filter vercelai-basics-generate demo
 */
import { generateText, streamText } from 'ai';
import { createChatModel } from 'vercelai-shared';

async function main(): Promise<void> {
  const model = createChatModel();

  // ---- 1. 一次性生成：generateText ----
  // instructions 是 v7 的新名字（取代 system，旧名仍可用但已标记 deprecated）
  const result = await generateText({
    model,
    instructions: '用中文回答，一句话，不要展开。',
    prompt: '什么是"工具调用"（tool calling）？',
    temperature: 0.7,
    maxOutputTokens: 300,
    maxRetries: 2,
  });
  console.log('【1】generateText:', result.text);
  console.log('    finishReason:', result.finishReason, '| usage:', result.usage);

  // ---- 2. 流式生成：streamText ----
  // result 是"流句柄"：textStream 立刻可迭代，usage/steps 等 await 后取终值
  const stream = streamText({
    model,
    prompt: '从 5 倒数到 1，每个数字单独一行，最后一行喊"发射！"',
  });
  process.stdout.write('【2】streamText: ');
  for await (const delta of stream.textStream) {
    process.stdout.write(delta);
  }
  console.log('\n    usage:', await stream.usage);

  // ---- 3. messages 形式（多轮对话历史）----
  const followup = await generateText({
    model,
    messages: [
      { role: 'user', content: '我叫小冯，最喜欢的语言是 TypeScript。' },
      { role: 'assistant', content: '收到！TypeScript 确实很适合大型项目。' },
      { role: 'user', content: '我的名字和喜欢的语言分别是什么？' },
    ],
  });
  console.log('【3】messages 多轮:', followup.text);
}

main().catch((error) => {
  console.error('demo 失败:', error);
  process.exitCode = 1;
});
