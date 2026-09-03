import { EventEmitter } from "node:events";

export const DESCRIPTION = "Learn the events module and EventEmitter.";

export function run(): void {
  console.log("Events");
  const emitter = new EventEmitter();
  emitter.on("greet", (name: string) => {
    console.log(`- hello, ${name}`);
  });
  emitter.emit("greet", "Node.js");
}