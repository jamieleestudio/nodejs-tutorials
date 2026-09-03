import * as monolith from "./monolith.js";
import * as microservice from "./microservice.js";
import * as distributed from "./distributed.js";

type Demo = {
  description: string;
  run: () => void;
};

const DEMOS: Record<string, Demo> = {
  monolith: { description: monolith.DESCRIPTION, run: monolith.run },
  microservice: { description: microservice.DESCRIPTION, run: microservice.run },
  distributed: { description: distributed.DESCRIPTION, run: distributed.run },
};

function main(): void {
  console.log("architecture");
  for (const [name, demo] of Object.entries(DEMOS)) {
    console.log(`- ${name}: ${demo.description}`);
    demo.run();
  }
}

main();