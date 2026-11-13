import { createDeepSeek } from '@ai-sdk/deepseek';
import type { LanguageModel } from 'ai';

/**
 * DeepSeek 聊天模型工厂（AI SDK 7）。
 *
 * 与 langchainjs-shared 的 createChatModel 对等：组内所有 demo 共用同一模型约定。
 * 官方 provider 自带重试、错误结构与 DeepSeek 专属选项
 * （V4 家族支持 thinking / reasoningEffort，见 vercelai-basics/providers）。
 */

/** 默认模型 ID：deepseek-chat 别名稳定可用；也可换 'deepseek-v4-flash' / 'deepseek-v4-pro' */
export const DEFAULT_CHAT_MODEL = 'deepseek-chat';

export function requireApiKey(): string {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY 未设置：请在 ai/vercelai/.env 中填入');
  }
  return apiKey;
}

/**
 * DeepSeek provider 实例。
 * 可直接调用 provider(modelId) 取语言模型，或用 provider.chat(modelId)。
 */
export function createDeepSeekProvider(apiKey: string = requireApiKey()) {
  return createDeepSeek({
    apiKey,
    baseURL: 'https://api.deepseek.com',
  });
}

/** 默认聊天模型（LanguageModel 接口实例） */
export function createChatModel(
  modelId: string = DEFAULT_CHAT_MODEL,
  apiKey: string = requireApiKey(),
): LanguageModel {
  return createDeepSeekProvider(apiKey)(modelId);
}
