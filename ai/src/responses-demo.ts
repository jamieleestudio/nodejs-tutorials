import OpenAI from "openai";
import { AI_CONFIG, checkApiKey } from "./config.js";

export const DESCRIPTION = "openai 7.x Responses API: client.responses.create() (stateful, typed outputs).";

export async function run(): Promise<void> {
  console.log("OpenAI Responses");
  if (!checkApiKey()) {
    return;
  }
  const client = new OpenAI({
    apiKey: AI_CONFIG.apiKey,
    baseURL: AI_CONFIG.baseURL,
    timeout: AI_CONFIG.timeout,
    maxRetries: AI_CONFIG.maxRetries,
  });
  try {
    // Responses API 是 OpenAI 主推的下一代接口（openai-node v5+ 引入，v7 成熟）：
    // input 直接吃消息数组，输出用 output_text 聚合，原生支持多轮状态/工具/结构化输出。
    // DeepSeek 的 OpenAI 兼容层目前只覆盖 chat.completions，若供应商不支持
    // /responses 端点会抛 404，这里照常打印错误。
    const response = await client.responses.create({
      model: AI_CONFIG.model,
      input: [
        { role: "system", content: "你是一个简洁的中文助手。" },
        { role: "user", content: "用一句话解释 Responses API 与 Chat Completions API 的区别。" },
      ],
    });
    console.log(`- model: ${AI_CONFIG.model}`);
    console.log(`- baseURL: ${client.baseURL}`);
    console.log(`- output_text: ${response.output_text}`);
    if (response.usage) {
      console.log(`- usage: input=${response.usage.input_tokens} output=${response.usage.output_tokens}`);
    }
  } catch (error) {
    console.log(`- model: ${AI_CONFIG.model}`);
    console.log(`- baseURL: ${client.baseURL}`);
    console.log(`- error: ${(error as Error).message}`);
  }
}
