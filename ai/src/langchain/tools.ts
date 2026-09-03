import { tool } from "langchain";
import { z } from "zod";

export const DESCRIPTION = "Tools: define callable tools with zod schemas.";

export async function run(): Promise<void> {
  console.log("LangChain Tools");

  const getWeather = tool(
    (input) => {
      return `It's always sunny in ${input.city}!`;
    },
    {
      name: "get_weather",
      description: "Get the weather for a given city.",
      schema: z.object({
        city: z.string().describe("The city to get the weather for."),
      }),
    }
  );

  const calculateSum = tool(
    (input) => {
      const result = input.a + input.b;
      return `The sum of ${input.a} and ${input.b} is ${result}.`;
    },
    {
      name: "calculate_sum",
      description: "Add two numbers together.",
      schema: z.object({
        a: z.number().describe("The first number."),
        b: z.number().describe("The second number."),
      }),
    }
  );

  console.log(`- tool 1: ${getWeather.name}`);
  console.log(`  description: ${getWeather.description}`);
  console.log(`- tool 2: ${calculateSum.name}`);
  console.log(`  description: ${calculateSum.description}`);

  console.log("- calling get_weather directly:");
  const weatherResult = await getWeather.invoke({ city: "Beijing" });
  console.log(`  result: ${weatherResult}`);

  console.log("- calling calculate_sum directly:");
  const sumResult = await calculateSum.invoke({ a: 3, b: 5 });
  console.log(`  result: ${sumResult}`);
}