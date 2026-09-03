import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { AI_CONFIG, checkApiKey } from "../config.js";

export const DESCRIPTION = "LCEL chains: compose prompt | model | parser pipeline.";

export async function run(): Promise<void> {
  console.log("LangChain Chains (LCEL)");
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
      ["system", "You are a concise assistant. Answer in one sentence."],
      ["human", "{question}"],
    ]);
    const parser = new StringOutputParser();

    const chain = prompt.pipe(model).pipe(parser);

    console.log("- chain: prompt | model | parser");
    console.log("- invoking chain with question...");

    const result = await chain.invoke({ question: "What is TypeScript?" });
    console.log(`- chain output: ${result}`);
  } catch (error) {
    console.log(`- error: ${(error as Error).message}`);
  }
}