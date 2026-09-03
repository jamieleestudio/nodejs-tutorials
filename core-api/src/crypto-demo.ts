import { createHash } from "node:crypto";

export const DESCRIPTION = "Learn the crypto module for hashing.";

export function run(): void {
  console.log("Crypto");
  const hash = createHash("sha256").update("Node.js").digest("hex");
  console.log(`- sha256("Node.js") = ${hash.slice(0, 16)}...`);
}