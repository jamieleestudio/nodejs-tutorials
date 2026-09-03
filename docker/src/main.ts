import * as dockerfileDemo from "./dockerfile-demo.js";
import * as composeDemo from "./compose-demo.js";

type Demo = {
  description: string;
  run: () => void;
};

const DEMOS: Record<string, Demo> = {
  dockerfile: { description: dockerfileDemo.DESCRIPTION, run: dockerfileDemo.run },
  compose: { description: composeDemo.DESCRIPTION, run: composeDemo.run },
};

function main(): void {
  console.log("docker");
  for (const [name, demo] of Object.entries(DEMOS)) {
    console.log(`- ${name}: ${demo.description}`);
    demo.run();
  }
}

main();