import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { AI_CONFIG, checkApiKey } from "../config.js";

export const DESCRIPTION = "ChatOpenAI basics: invoke() and message types (System/Human/AI).";

export async function run(): Promise<void> {
  console.log("LangChain Chat Models");
  if (!checkApiKey()) {
    return;
  }

  const model = new ChatOpenAI({
    model: AI_CONFIG.model,
    configuration: { baseURL: AI_CONFIG.baseURL },
    apiKey: AI_CONFIG.apiKey,
    timeout: AI_CONFIG.timeout,
    maxRetries: AI_CONFIG.maxRetries,
  });

  try {
    console.log(`- model: ${model.model}`);
    console.log("- sending SystemMessage + HumanMessage...");

    const response = await model.invoke([
      new SystemMessage("You are a concise assistant. Reply in one sentence."),
      new HumanMessage("What is Node.js?"),
    ]);

    console.log(`- AI response: ${response.content}`);
    console.log(`- message type: ${response._getType()}`);
  } catch (error) {
    console.log(`- error: ${(error as Error).message}`);
  }
}