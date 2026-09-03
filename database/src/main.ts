import { run as sqliteRun, DESCRIPTION as sqliteDesc } from "./sqlite-demo.js";

type Demo = {
  description: string;
  run: () => void;
};

const DEMOS: Record<string, Demo> = {
  sqlite: { description: sqliteDesc, run: sqliteRun },
};

function main(): void {
  console.log("database");
  for (const [name, demo] of Object.entries(DEMOS)) {
    console.log(`- ${name}: ${demo.description}`);
    demo.run();
  }
}

main();