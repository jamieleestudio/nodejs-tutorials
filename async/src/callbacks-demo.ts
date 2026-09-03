export const DESCRIPTION = "Learn callbacks and error-first convention.";

export function run(): void {
  console.log("Callbacks");
  function fetchData(callback: (error: Error | null, data?: string) => void): void {
    setTimeout(() => callback(null, "data from callback"), 10);
  }
  fetchData((error, data) => {
    if (error) {
      console.log(`- error: ${error.message}`);
      return;
    }
    console.log(`- received: ${data}`);
  });
}