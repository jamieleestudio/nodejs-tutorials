/**
 * AI SDK 7 护栏中间件：PII 入向/出向脱敏 + 思维链分离
 *
 * - 入向（transformParams）：进模型前把手机号/证件号/邮箱替换成占位符——不泄露给上游
 * - 出向（wrapGenerate）：模型输出进应用前再扫一遍——防止模型自己编出敏感信息
 * - 思维链：deepseek-reasoner 的 reasoning 与 text 在流里天然分开（官方 provider 已拆好）；
 *   若走 openai-compatible 接内联 <think> 标签的第三方网关，用 extractReasoningMiddleware()
 *
 * 对照：langchainjs-guardrails/guardrails-middleware（RunnableLambda 包模型的同款思路）。
 *
 * 运行：pnpm --filter vercelai-middleware-guardrails demo
 */
import { generateText, streamText, wrapLanguageModel, type LanguageModelMiddleware } from 'ai';
import type { LanguageModelV4Prompt } from '@ai-sdk/provider';
import { createDeepSeekProvider } from 'vercelai-shared';

const PATTERNS: Array<[RegExp, string]> = [
  [/\b1[3-9]\d{9}\b/g, '[手机号]'],
  [/\b1[3-9]\d[-\s]?\d{4}[-\s]?\d{4}\b/g, '[手机号]'],
  [/\b\d{17}[\dXx]\b/g, '[证件号]'],
  [/[\w.+-]+@[\w-]+\.[\w.]+/g, '[邮箱]'],
];

function redact(text: string): string {
  return PATTERNS.reduce((acc, [re, repl]) => acc.replace(re, repl), text);
}

/** 入向 + 出向双向脱敏中间件 */
const piiGuardMiddleware: LanguageModelMiddleware = {
  // 入向：provider 级 prompt 是消息数组——system 是字符串、user 内容里翻 text part
  transformParams: async ({ params }) => {
    const prompt: LanguageModelV4Prompt = params.prompt.map((message) => {
      if (message.role === 'system') {
        return { ...message, content: redact(message.content) };
      }
      if (message.role === 'user') {
        return {
          ...message,
          content: message.content.map((part) =>
            part.type === 'text' ? { ...part, text: redact(part.text) } : part,
          ),
        };
      }
      return message;
    });
    return { ...params, prompt };
  },
  // 出向：模型生成的内容进应用前再扫一遍
  wrapGenerate: async ({ doGenerate }) => {
    const result = await doGenerate();
    return {
      ...result,
      content: result.content.map((part) =>
        part.type === 'text' ? { ...part, text: redact(part.text) } : part,
      ),
    };
  },
};

async function main(): Promise<void> {
  const deepseek = createDeepSeekProvider();

  // ---- 1. 入向脱敏：洋葱模型——外层先改 params，内层日志看到"模型实际收到的"----
  const observed = wrapLanguageModel({
    model: deepseek('deepseek-chat'),
    middleware: {
      transformParams: async ({ params }) => {
        const firstUser = params.prompt.find((m) => m.role === 'user');
        if (firstUser && firstUser.role === 'user') {
          const textPart = firstUser.content.find((p) => p.type === 'text');
          if (textPart && textPart.type === 'text') console.log('    → 模型收到:', textPart.text);
        }
        return params;
      },
    },
  });
  const guarded = wrapLanguageModel({ model: observed, middleware: piiGuardMiddleware });
  console.log('【1】入向脱敏：');
  const { text: echo } = await generateText({
    model: guarded,
    prompt: '我的手机号是 13812345678，邮箱 feng@example.com。请复述我的联系方式。',
  });
  console.log('    模型复述:', echo.trim());

  // ---- 2. 出向脱敏：让模型写"假的"联系方式，中间件负责抹掉 ----
  console.log('【2】出向脱敏：');
  const { text } = await generateText({
    model: guarded,
    instructions: '编造一组示例联系方式（手机号、邮箱），组成一句介绍。',
    prompt: '生成示例联系方式。',
  });
  console.log('    应用拿到:', text);

  // ---- 3. 思维链分离：reasoner 的 reasoning / text 两种流事件 ----
  console.log('【3】思维链（deepseek-reasoner）：');
  const reasoner = deepseek('deepseek-reasoner');
  let reasoningChars = 0;
  for await (const part of streamText({
    model: reasoner,
    prompt: '9.11 和 9.9 哪个大？想清楚再答。',
  }).stream) {
    if (part.type === 'reasoning-delta') reasoningChars += part.text.length;
    if (part.type === 'text-delta') process.stdout.write(part.text);
  }
  console.log(`\n    （思考过程 ${reasoningChars} 字符，已与正文分离，不进对话记录）`);
}

main().catch((error) => {
  console.error('demo 失败:', error);
  process.exitCode = 1;
});
