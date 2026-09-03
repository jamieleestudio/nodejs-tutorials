import OpenAI from "openai";
import { AI_CONFIG, checkApiKey } from "./config.js";

export const DESCRIPTION = "Learn OpenAI chat completions with the official SDK.";

export async function run(): Promise<void> {
  console.log("OpenAI");
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
    const completion = await client.chat.completions.create({
      model: AI_CONFIG.model,
      messages: [{ role: "user", content: "Say hello in one word." }],
    });
    console.log(`- model: ${AI_CONFIG.model}`);
    console.log(`- baseURL: ${client.baseURL}`);
    console.log(`- response: ${completion.choices[0]?.message?.content}`);
  } catch (error) {
    console.log(`- model: ${AI_CONFIG.model}`);
    console.log(`- baseURL: ${client.baseURL}`);
    console.log(`- error: ${(error as Error).message}`);
  }
}