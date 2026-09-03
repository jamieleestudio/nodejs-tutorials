export const DESCRIPTION = "Learn generics and type constraints.";

function identity<T>(value: T): T {
  return value;
}

function first<T extends { length: number }>(items: T): T[number] {
  return items[0];
}

export function run(): void {
  console.log("Generics");
  console.log(`- identity: ${identity("Node.js")}`);
  console.log(`- first: ${first([1, 2, 3])}`);
}