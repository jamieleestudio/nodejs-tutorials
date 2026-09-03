import * as variables from "./variables.js";
import * as controlFlow from "./control-flow.js";

type Demo = {
  description: string;
  run: () => void;
};

const DEMOS: Record<string, Demo> = {
  variables: { description: variables.DESCRIPTION, run: variables.run },
  control_flow: { description: controlFlow.DESCRIPTION, run: controlFlow.run },
};

function main(): void {
  console.log("basics");
  for (const [name, demo] of Object.entries(DEMOS)) {
    console.log(`- ${name}: ${demo.description}`);
    demo.run();
  }
}

main();