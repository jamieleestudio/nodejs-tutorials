import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { AI_CONFIG, checkApiKey } from "../config.js";

export const DESCRIPTION = "Output parsers: StringOutputParser and structured output with zod.";

export async function run(): Promise<void> {
  console.log("LangChain Output Parsers");
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
    console.log("--- StringOutputParser ---");
    const prompt = ChatPromptTemplate.fromMessages([
      ["human", "Say hello in {language}."],
    ]);
    const stringParser = new StringOutputParser();
    const response = await stringParser.invoke(await model.invoke(await prompt.invoke({ language: "Japanese" })));
    console.log(`- parsed string: ${response}`);
  } catch (error) {
    console.log(`- StringOutputParser error: ${(error as Error).message}`);
  }

  try {
    console.log("--- Structured Output (zod) ---");
    const citySchema = z.object({
      name: z.string().describe("The city name"),
      country: z.string().describe("The country the city is in"),
      population: z.number().describe("The population of the city"),
    });

    const structuredModel = model.withStructuredOutput(citySchema, { method: "functionCalling" });
    const result = await structuredModel.invoke("Tell me about Tokyo.");
    console.log(`- structured result: ${JSON.stringify(result)}`);
    console.log(`- name: ${result.name}, country: ${result.country}, population: ${result.population}`);
  } catch (error) {
    console.log(`- Structured Output error: ${(error as Error).message}`);
    console.log("- note: some providers (e.g. DeepSeek) may not support structured output");
  }
}