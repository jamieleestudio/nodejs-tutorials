export const DESCRIPTION = "Learn async/await and error handling.";

export async function run(): Promise<void> {
  console.log("Async/Await");
  async function fetchUser(id: number): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(`user-${id}`), 10);
    });
  }
  try {
    const user = await fetchUser(1);
    console.log(`- received: ${user}`);
  } catch (error) {
    console.log(`- error: ${(error as Error).message}`);
  }
}