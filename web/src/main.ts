import { run as httpRun, DESCRIPTION as httpDesc } from "./http-demo.js";
import { run as expressRun, DESCRIPTION as expressDesc } from "./express-demo.js";

type Demo = {
  description: string;
  run: () => void | Promise<void>;
};

const DEMOS: Record<string, Demo> = {
  http: { description: httpDesc, run: httpRun },
  express: { description: expressDesc, run: expressRun },
};

async function main(): Promise<void> {
  console.log("web");
  for (const [name, demo] of Object.entries(DEMOS)) {
    console.log(`- ${name}: ${demo.description}`);
    await demo.run();
  }
}

main();