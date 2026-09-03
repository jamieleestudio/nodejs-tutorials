export const DESCRIPTION = "Learn Promises and chaining.";

export async function run(): Promise<void> {
  console.log("Promises");
  const result = await new Promise<string>((resolve) => {
    setTimeout(() => resolve("data from promise"), 10);
  });
  console.log(`- received: ${result}`);
}