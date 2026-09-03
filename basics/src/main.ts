import * as variables from "./variables.js";
import * as dataTypes from "./data-types.js";
import * as controlFlow from "./control-flow.js";
import * as functions from "./functions.js";
import * as arrays from "./arrays.js";
import * as objects from "./objects.js";
import * as types from "./types.js";
import * as enums from "./enums.js";
import * as generics from "./generics.js";
import * as destructuring from "./destructuring.js";
import * as spreadRest from "./spread-rest.js";
import * as templateLiterals from "./template-literals.js";

type Demo = {
  description: string;
  run: () => void;
};

const DEMOS: Record<string, Demo> = {
  variables: { description: variables.DESCRIPTION, run: variables.run },
  data_types: { description: dataTypes.DESCRIPTION, run: dataTypes.run },
  control_flow: { description: controlFlow.DESCRIPTION, run: controlFlow.run },
  functions: { description: functions.DESCRIPTION, run: functions.run },
  arrays: { description: arrays.DESCRIPTION, run: arrays.run },
  objects: { description: objects.DESCRIPTION, run: objects.run },
  types: { description: types.DESCRIPTION, run: types.run },
  enums: { description: enums.DESCRIPTION, run: enums.run },
  generics: { description: generics.DESCRIPTION, run: generics.run },
  destructuring: { description: destructuring.DESCRIPTION, run: destructuring.run },
  spread_rest: { description: spreadRest.DESCRIPTION, run: spreadRest.run },
  template_literals: { description: templateLiterals.DESCRIPTION, run: templateLiterals.run },
};

function main(): void {
  console.log("basics");
  for (const [name, demo] of Object.entries(DEMOS)) {
    console.log(`- ${name}: ${demo.description}`);
    demo.run();
  }
}

main();