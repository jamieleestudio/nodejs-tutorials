import { createChatModel } from 'langchainjs-shared';

/**
 * 流式输出：model.stream() 返回异步可迭代流，逐 chunk 输出。
 * 对照 Java 侧 TokenStream / Flux<String>。
 */
async function main(): Promise<void> {
  const model = createChatModel();

  process.stdout.write('- streaming: ');
  const stream = await model.stream('写一首关于春天的五言绝句');
  for await (const chunk of stream) {
    const text = typeof chunk.content === 'string' ? chunk.content : '';
    process.stdout.write(text);
  }
  process.stdout.write('\n');
}

main();
