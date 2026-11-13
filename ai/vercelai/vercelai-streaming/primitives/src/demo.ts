/**
 * AI SDK 7 流式原语：fullStream 事件 / consumeStream / simulateReadableStream
 *
 * 对照：langchainjs-basics/streaming（AIMessageChunk 流 + .streamEvents）。
 *
 * 运行：pnpm --filter vercelai-streaming-primitives demo
 */
import { streamText, consumeStream, simulateReadableStream } from 'ai';
import { createChatModel } from 'vercelai-shared';

async function main(): Promise<void> {
  const model = createChatModel();

  // ---- 1. stream：所有事件的统一异步流（v7 新名，fullStream 已 deprecated）----
  // text-delta 只是其中一种事件；start/finish/tool-call/error... 都在这条流里
  const stream = streamText({ model, prompt: '用三句话介绍 TypeScript 的核心优势。' });
  process.stdout.write('【1】stream 事件流:\n');
  for await (const part of stream.stream) {
    switch (part.type) {
      case 'text-delta':
        process.stdout.write(part.text);
        break;
      case 'finish':
        console.log(
          `\n    ↳ finish 事件：finishReason=${part.finishReason}，totalTokens=${part.totalUsage.totalTokens}`,
        );
        break;
      default:
        console.log(`    ↳ 事件: ${part.type}`);
    }
  }

  // ---- 2. consumeStream：后台消费（不阻塞主流程取终值）----
  const bg = streamText({ model, prompt: '一句话：什么是类型收窄？' });
  const consumed = consumeStream({ stream: bg.stream }); // 不 await，先干别的
  const text = await bg.text; // 句柄的终值属性会自动等流结束
  await consumed;
  console.log('\n【2】consumeStream 后台消费完成:', text);

  // ---- 3. simulateReadableStream：把假数据变成"流"——测试流式 UI 不用真模型 ----
  const mock = simulateReadableStream({
    chunks: ['你', '好', '，', '流', '式', '世', '界', '！'],
    initialDelayInMs: 200,
    chunkDelayInMs: 80,
  });
  process.stdout.write('【3】模拟流: ');
  for await (const chunk of mock) {
    process.stdout.write(chunk);
  }
  console.log();
}

main().catch((error) => {
  console.error('demo 失败:', error);
  process.exitCode = 1;
});
