import { createAgent, tool } from "langchain";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { AI_CONFIG, checkApiKey } from "../config.js";

export const DESCRIPTION = "Agents: createAgent with tools for tool-calling workflows.";

export async function run(): Promise<void> {
  console.log("LangChain Agents");
  if (!checkApiKey()) {
    console.log("- set OPENAI_API_KEY to run a live agent");
    return;
  }

  const getWeather = tool(
    (input) => `It's always sunny in ${input.city}!`,
    {
      name: "get_weather",
      description: "Get the weather for a given city.",
      schema: z.object({
        city: z.string().describe("The city to get the weather for."),
      }),
    }
  );

  try {
    const model = new ChatOpenAI({
      model: AI_CONFIG.model,
      configuration: { baseURL: AI_CONFIG.baseURL },
      apiKey: AI_CONFIG.apiKey,
      timeout: 60_000,
      maxRetries: AI_CONFIG.maxRetries,
    });

    console.log("- creating agent with model + get_weather tool...");
    const agent = createAgent({
      model,
      tools: [getWeather],
    });

    console.log("- invoking agent: \"What's the weather in Beijing?\"");
    const result = await agent.invoke({
      messages: [{ role: "user", content: "What's the weather in Beijing?" }],
    });

    const lastMessage = result.messages[result.messages.length - 1];
    console.log(`- agent response: ${lastMessage.content}`);
    console.log(`- total messages in conversation: ${result.messages.length}`);
  } catch (error) {
    console.log(`- error: ${(error as Error).message}`);
  }
}