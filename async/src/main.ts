import * as callbacksDemo from "./callbacks-demo.js";
import * as promisesDemo from "./promises-demo.js";
import * as asyncAwaitDemo from "./async-await-demo.js";

type Demo = {
  description: string;
  run: () => void | Promise<void>;
};

const DEMOS: Record<string, Demo> = {
  callbacks: { description: callbacksDemo.DESCRIPTION, run: callbacksDemo.run },
  promises: { description: promisesDemo.DESCRIPTION, run: promisesDemo.run },
  async_await: { description: asyncAwaitDemo.DESCRIPTION, run: asyncAwaitDemo.run },
};

async function main(): Promise<void> {
  console.log("async");
  for (const [name, demo] of Object.entries(DEMOS)) {
    console.log(`- ${name}: ${demo.description}`);
    await demo.run();
  }
}

main();