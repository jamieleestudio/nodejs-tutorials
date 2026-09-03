export function add(a: number, b: number): number {
  return a + b;
}

export function greet(name: string): string {
  return `Hello, ${name}!`;
}

export const DESCRIPTION = "Learn unit testing with Vitest.";

export function run(): void {
  console.log("Unit Tests (summary)");
  console.log("- run `npm test` to execute math.test.ts");
  console.log(`- add(2, 3) = ${add(2, 3)}`);
  console.log(`- greet("Node") = ${greet("Node")}`);
}