/**
 * AI SDK 7 中间件基础：wrapLanguageModel 三板斧
 *
 * 中间件 = 在"模型实例"外再包一层：transformParams 改请求、wrapGenerate/wrapStream 截响应。
 * v7：LanguageModelMiddleware 不再要求 specificationVersion（V4 为基底，兼容 V3 写法）。
 *
 * 运行：pnpm --filter vercelai-middleware-basics demo
 */
import {
  generateText,
  streamText,
  wrapLanguageModel,
  defaultSettingsMiddleware,
  simulateStreamingMiddleware,
  type LanguageModelMiddleware,
} from 'ai';
import { createDeepSeekProvider } from 'vercelai-shared';

/** 通用日志中间件：进看请求、出看结果 */
const loggingMiddleware: LanguageModelMiddleware = {
  transformParams: async ({ type, params }) => {
    console.log(`    → [日志] ${type} 请求：temperature=${params.temperature}，消息 ${params.prompt.length} 条`);
    return params;
  },
  wrapGenerate: async ({ doGenerate }) => {
    const start = Date.now();
    const result = await doGenerate();
    console.log(`    ← [日志] 生成完成：${Date.now() - start}ms，finishReason=${result.finishReason.unified}`);
    return result;
  },
};

async function main(): Promise<void> {
  const deepseek = createDeepSeekProvider();

  // ---- 1. 日志中间件：观测每一次模型调用 ----
  const logged = wrapLanguageModel({ model: deepseek('deepseek-chat'), middleware: loggingMiddleware });
  await generateText({ model: logged, prompt: '一句话介绍中间件模式。' });

  // ---- 2. defaultSettingsMiddleware：给模型实例定默认参数 ----
  // 调用处不传 temperature 时自动生效；显式传参则覆盖默认值
  const withDefaults = wrapLanguageModel({
    model: deepseek('deepseek-chat'),
    middleware: [defaultSettingsMiddleware({ settings: { temperature: 0.3 } }), loggingMiddleware],
  });
  console.log('【2a】未传 temperature（吃默认 0.3）:');
  await generateText({ model: withDefaults, prompt: '一句话介绍依赖注入。' });
  console.log('【2b】显式传 temperature=0.9（覆盖默认）:');
  await generateText({ model: withDefaults, prompt: '一句话介绍函数式编程。', temperature: 0.9 });

  // ---- 3. simulateStreamingMiddleware：把 generate 伪装成 stream（测试利器）----
  // 模型本身只支持一次性生成；包上它，streamText 照样能跑
  const fakeStream = wrapLanguageModel({
    model: deepseek('deepseek-chat'),
    middleware: simulateStreamingMiddleware(),
  });
  process.stdout.write('【3】simulateStreaming: ');
  for await (const delta of streamText({ model: fakeStream, prompt: '倒数三个数：三、二、一。' }).textStream) {
    process.stdout.write(delta);
  }
  console.log();
}

main().catch((error) => {
  console.error('demo 失败:', error);
  process.exitCode = 1;
});
