import { run as openaiRun, DESCRIPTION as openaiDesc } from "./openai-demo.js";
import { DEMOS as langchainDemos } from "./langchain/index.js";

type Demo = {
  description: string;
  run: () => void | Promise<void>;
};

const DEMOS: Record<string, Demo> = {
  openai: { description: openaiDesc, run: openaiRun },
  ...langchainDemos,
};

async function main(): Promise<void> {
  console.log("ai");
  for (const [name, demo] of Object.entries(DEMOS)) {
    console.log(`- ${name}: ${demo.description}`);
    await demo.run();
  }
}

main();