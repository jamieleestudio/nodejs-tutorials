/**
 * AI SDK 7 Provider 抽象：官方 @ai-sdk/deepseek vs 通用 @ai-sdk/openai-compatible
 *
 * 核心卖点：所有业务代码只面向 LanguageModel 接口——换供应商/换端点只换"造模型"那一行。
 * 对照：langchainjs-basics/chat-models 里 ChatOpenAI ↔ ChatAnthropic 的替换关系。
 *
 * 运行：pnpm --filter vercelai-basics-providers demo
 */
import { createDeepSeek } from '@ai-sdk/deepseek';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateText, APICallError, AISDKError } from 'ai';
import { requireApiKey } from 'vercelai-shared';

async function main(): Promise<void> {
  const apiKey = requireApiKey();

  // ---- 1. 官方 provider：自带 DeepSeek 错误结构与专属选项 ----
  const deepseek = createDeepSeek({ apiKey, baseURL: 'https://api.deepseek.com' });
  const officialModel = deepseek('deepseek-chat'); // 等价于 deepseek.chat('deepseek-chat')

  // ---- 2. 通用 openai-compatible：任何"OpenAI 兼容"端点都能接 ----
  // 本地 Ollama/vLLM、OpenRouter、OneAPI 网关……换 baseURL 即换供应商
  const generic = createOpenAICompatible({
    name: 'deepseek-compatible',
    baseURL: 'https://api.deepseek.com',
    apiKey,
  });
  const compatibleModel = generic.chatModel('deepseek-chat');

  const question = '用一句话介绍你自己的能力边界。';
  const r1 = await generateText({ model: officialModel, prompt: question });
  const r2 = await generateText({ model: compatibleModel, prompt: question });
  console.log('【1】官方 @ai-sdk/deepseek     :', r1.text);
  console.log('【2】通用 @ai-sdk/openai-compatible:', r2.text);

  // ---- 3. 错误分类：按类型精确处理（key 无效 → 401）----
  try {
    const broken = createDeepSeek({ apiKey: 'sk-invalid' })('deepseek-chat');
    await generateText({ model: broken, prompt: 'ping', maxRetries: 0 });
  } catch (error) {
    if (APICallError.isInstance(error)) {
      console.log('【3】APICallError: HTTP', error.statusCode, '| isRetryable:', error.isRetryable);
    } else if (AISDKError.isInstance(error)) {
      console.log('【3】AI SDK 错误:', error.name, '-', error.message);
    } else {
      throw error;
    }
  }

  // ---- 备注：DeepSeek V4 家族专属选项（providerOptions）----
  // 'deepseek-v4-flash' / 'deepseek-v4-pro' 支持 thinking（开关思维链）与
  // reasoningEffort（low/high/max），通过 generateText 的
  // providerOptions: { deepseek: { thinking: { type: 'disabled' } } } 传入。
  // 'deepseek-chat' 别名走非思考模式，无需配置。
}

main().catch((error) => {
  console.error('demo 失败:', error);
  process.exitCode = 1;
});
