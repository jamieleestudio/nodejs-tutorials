import { run as bcryptRun, DESCRIPTION as bcryptDesc } from "./bcrypt-demo.js";
import { run as jwtRun, DESCRIPTION as jwtDesc } from "./jwt-demo.js";

type Demo = {
  description: string;
  run: () => void;
};

const DEMOS: Record<string, Demo> = {
  bcrypt: { description: bcryptDesc, run: bcryptRun },
  jwt: { description: jwtDesc, run: jwtRun },
};

function main(): void {
  console.log("auth");
  for (const [name, demo] of Object.entries(DEMOS)) {
    console.log(`- ${name}: ${demo.description}`);
    demo.run();
  }
}

main();