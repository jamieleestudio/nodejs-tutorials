import { ChatOpenAI } from '@langchain/openai';

/**
 * DeepSeek 聊天模型工厂：OpenAI 兼容协议 + baseUrl 指向 DeepSeek。
 * 与 Java 侧 langchain4j-open-ai 的 baseUrl 用法一致。
 */
export function createChatModel(overrides: Record<string, unknown> = {}): ChatOpenAI {
  return new ChatOpenAI({
    model: 'deepseek-chat',
    apiKey: process.env.DEEPSEEK_API_KEY,
    configuration: { baseURL: 'https://api.deepseek.com' },
    temperature: 0.7,
    ...overrides,
  });
}

export function requireApiKey(): string {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) {
    throw new Error('DEEPSEEK_API_KEY 未设置：请在 ai/langchainjs/.env 中填入');
  }
  return key;
}
