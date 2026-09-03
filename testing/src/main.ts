import * as math from "./math.js";

type Demo = {
  description: string;
  run: () => void;
};

const DEMOS: Record<string, Demo> = {
  unit: { description: math.DESCRIPTION, run: math.run },
};

function main(): void {
  console.log("testing");
  for (const [name, demo] of Object.entries(DEMOS)) {
    console.log(`- ${name}: ${demo.description}`);
    demo.run();
  }
}

main();