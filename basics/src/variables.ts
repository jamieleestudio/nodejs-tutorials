export const DESCRIPTION = "Learn variables, types, and basic assignment.";

export function run(): void {
  console.log("Variables");
  const name: string = "Node.js";
  const version: number = 20.17;
  const isFun: boolean = true;
  console.log(`- name=${JSON.stringify(name)} (${typeof name})`);
  console.log(`- version=${version} (${typeof version})`);
  console.log(`- isFun=${isFun} (${typeof isFun})`);
}