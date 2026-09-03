import * as fsDemo from "./fs-demo.js";
import * as eventsDemo from "./events-demo.js";
import * as cryptoDemo from "./crypto-demo.js";

type Demo = {
  description: string;
  run: () => void;
};

const DEMOS: Record<string, Demo> = {
  fs: { description: fsDemo.DESCRIPTION, run: fsDemo.run },
  events: { description: eventsDemo.DESCRIPTION, run: eventsDemo.run },
  crypto: { description: cryptoDemo.DESCRIPTION, run: cryptoDemo.run },
};

function main(): void {
  console.log("core-api");
  for (const [name, demo] of Object.entries(DEMOS)) {
    console.log(`- ${name}: ${demo.description}`);
    demo.run();
  }
}

main();