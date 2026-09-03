import { ChatOpenAI } from "@langchain/openai";
import {
  BaseMessage,
  SystemMessage,
  HumanMessage,
  AIMessage,
} from "@langchain/core/messages";
import { AI_CONFIG, checkApiKey } from "../config.js";

export const DESCRIPTION = "Conversation memory: multi-turn chat with message history.";

export async function run(): Promise<void> {
  console.log("LangChain Memory");
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
    const history: BaseMessage[] = [
      new SystemMessage("You are a helpful assistant. Remember the user's name."),
      new HumanMessage("Hi, my name is Alice."),
    ];

    console.log("--- Turn 1 ---");
    const response1 = await model.invoke(history);
    console.log(`- AI: ${response1.content}`);

    history.push(new AIMessage(String(response1.content)));

    console.log("--- Turn 2 (with context) ---");
    history.push(new HumanMessage("What is my name?"));
    const response2 = await model.invoke(history);
    console.log(`- AI: ${response2.content}`);
    console.log(`- history length: ${history.length} messages`);
  } catch (error) {
    console.log(`- error: ${(error as Error).message}`);
  }
}