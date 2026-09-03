import fs from "node:fs";
import path from "node:path";
import os from "node:os";

export const DESCRIPTION = "Learn the fs, path, and os core modules.";

export function run(): void {
  console.log("File System");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "nt-core-api-"));
  const file = path.join(tmp, "hello.txt");
  fs.writeFileSync(file, "Hello from Node.js!", "utf8");
  console.log(`- wrote: ${file}`);
  console.log(`- read: ${fs.readFileSync(file, "utf8")}`);
  console.log(`- basename: ${path.basename(file)}`);
  console.log(`- tmpdir: ${os.tmpdir()}`);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log("- cleaned up");
}