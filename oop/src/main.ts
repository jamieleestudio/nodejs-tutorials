import * as classes from "./classes.js";
import * as inheritance from "./inheritance.js";
import * as generics from "./generics.js";

type Demo = {
  description: string;
  run: () => void;
};

const DEMOS: Record<string, Demo> = {
  classes: { description: classes.DESCRIPTION, run: classes.run },
  inheritance: { description: inheritance.DESCRIPTION, run: inheritance.run },
  generics: { description: generics.DESCRIPTION, run: generics.run },
};

function main(): void {
  console.log("oop");
  for (const [name, demo] of Object.entries(DEMOS)) {
    console.log(`- ${name}: ${demo.description}`);
    demo.run();
  }
}

main();