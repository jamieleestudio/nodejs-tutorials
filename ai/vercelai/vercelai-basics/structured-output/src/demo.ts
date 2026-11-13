/**
 * AI SDK 7 结构化输出：generateText/streamText + Output
 *
 * v7 正统姿势：Output 命名空间已转正（text/object/array/choice/json），
 * 结构化输出统一走 generateText / streamText 的 output 参数；
 * 旧 API generateObject / streamObject 仍可用但已标记 deprecated。
 * schema 即类型：zod schema 同时承担"给模型的约束 + TS 类型 + 运行时校验"。
 *
 * 对照：langchainjs-agents/agent-structured-output（.withStructuredOutput(schema)）。
 *
 * 运行：pnpm --filter vercelai-basics-structured-output demo
 */
import { generateText, streamText, Output, NoObjectGeneratedError } from 'ai';
import { z } from 'zod';
import { createChatModel } from 'vercelai-shared';

const MovieSchema = z.object({
  title: z.string().describe('电影名'),
  year: z.number().int().describe('上映年份'),
  genre: z.enum(['科幻', '喜剧', '动作', '剧情', '动画']),
  rating: z.number().min(0).max(10),
  summary: z.string().describe('一句话剧情'),
});
type Movie = z.infer<typeof MovieSchema>;

async function main(): Promise<void> {
  const model = createChatModel();

  // ---- 1. generateText + Output.object：一次性拿校验过的对象 ----
  // 模型输出不符合 schema 会抛 NoObjectGeneratedError（可配 maxRetries 自动重试）
  try {
    const { output: movie, finishReason } = await generateText({
      model,
      output: Output.object({ schema: MovieSchema }),
      prompt: '推荐一部国产科幻电影，写明上映年份、类型、评分和一句话剧情。',
    });
    console.log('【1】generateText + Output.object:', JSON.stringify(movie, null, 2), '| finishReason:', finishReason);
  } catch (error) {
    if (NoObjectGeneratedError.isInstance(error)) {
      console.error('生成结果不符合 schema:', error.message);
      throw error;
    }
    throw error;
  }

  // ---- 2. streamText + Output.object：partialOutputStream 边生成边拿"部分对象" ----
  const stream = streamText({
    model,
    output: Output.object({ schema: MovieSchema }),
    prompt: '推荐一部宫崎骏的动画电影，写明全部信息。',
  });
  for await (const partial of stream.partialOutputStream) {
    // DeepPartial<Movie>：字段随生成逐步补全，适合流式渲染 UI
    console.log('【2】partial:', JSON.stringify(partial));
  }
  const finalMovie: Movie = await stream.output;
  console.log('【2】完成:', finalMovie.title, `(${finalMovie.year})`);

  // ---- 3. Output.choice / Output.array：结构化输出的其他形态 ----
  const { output: pick } = await generateText({
    model,
    output: Output.choice({ options: ['退款', '物流', '其他'] }),
    prompt: '对这条留言做分类："我的快递三天没动了，里面是生日蛋糕！"',
  });
  console.log('【3a】Output.choice 分类:', pick);

  const { output: todos } = await generateText({
    model,
    output: Output.array({ element: z.string() }),
    prompt: '列出学习 TypeScript 的 3 个步骤，每步一句话。',
  });
  console.log('【3b】Output.array 步骤:', todos);
}

main().catch((error) => {
  console.error('demo 失败:', error);
  process.exitCode = 1;
});
