/**
 * AI SDK 7 流式变换：smoothStream 平滑输出 + partialOutputStream 部分 JSON 流
 *
 * 对照：langchainjs-basics/streaming（transform 回调逐 token 改写）。
 *
 * 运行：pnpm --filter vercelai-streaming-transform demo
 */
import { streamText, smoothStream, Output } from 'ai';
import { z } from 'zod';
import { createChatModel } from 'vercelai-shared';

const PoiSchema = z.object({
  name: z.string().describe('景点名'),
  city: z.string(),
  highlight: z.string().describe('一句话亮点'),
});

async function main(): Promise<void> {
  const model = createChatModel();

  // ---- 1. smoothStream：原始 token 流 → 按词切分 + 固定节奏输出 ----
  // 直连模型的原始流往往一顿一顿（网络/采样抖动）；transform 在展示层抹平
  const smoothed = streamText({
    model,
    prompt: '用 60 字左右介绍西湖。',
    experimental_transform: smoothStream({ chunking: 'word', delayInMs: 25 }),
  });
  process.stdout.write('【1】smoothStream: ');
  for await (const delta of smoothed.textStream) {
    process.stdout.write(delta);
  }
  console.log('\n');

  // ---- 2. streamText + Output.object：partialOutputStream 看 JSON 逐步成形 ----
  // 每个事件都是"到目前为止校验过的半成品对象"（DeepPartial<Poi>）——
  // 流式渲染表单/卡片的标准姿势，同时天然展示模型的结构化生成过程
  const objStream = streamText({
    model,
    output: Output.object({ schema: PoiSchema }),
    prompt: '推荐一个杭州周边的景点。',
  });
  for await (const partial of objStream.partialOutputStream) {
    console.log('【2】partial:', JSON.stringify(partial));
  }
  const poi = await objStream.output;
  console.log('    ↳ 校验后的终值:', poi);
}

main().catch((error) => {
  console.error('demo 失败:', error);
  process.exitCode = 1;
});
