import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { AI_CONFIG, checkApiKey } from "../config.js";

export const DESCRIPTION = "ChatPromptTemplate: build prompts with variable interpolation.";

export async function run(): Promise<void> {
  console.log("LangChain Prompt Templates");
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
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", "You are a helpful assistant specialized in {topic}."],
      ["human", "Explain {concept} in one sentence."],
    ]);

    console.log("- template variables: topic, concept");

    const formatted = await prompt.invoke({ topic: "Node.js", concept: "event loop" });
    console.log("- formatted messages:");
    for (const msg of formatted.messages) {
      console.log(`  [${msg._getType()}] ${msg.content}`);
    }

    const response = await model.invoke(formatted);
    console.log(`- AI response: ${response.content}`);
  } catch (error) {
    console.log(`- error: ${(error as Error).message}`);
  }
}