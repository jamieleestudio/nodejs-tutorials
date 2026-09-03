export const AI_CONFIG = {
  apiKey: process.env.OPENAI_API_KEY ?? "",
  baseURL: process.env.OPENAI_BASE_URL ?? "https://api.deepseek.com",
  model: process.env.OPENAI_MODEL ?? "deepseek-chat",
  timeout: 30_000,
  maxRetries: 2,
};

export function checkApiKey(): boolean {
  if (!AI_CONFIG.apiKey) {
    console.log("- set OPENAI_API_KEY to run a live completion");
    return false;
  }
  return true;
}