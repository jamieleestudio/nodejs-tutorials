import * as chatModels from "./chat-models.js";
import * as promptTemplates from "./prompt-templates.js";
import * as outputParsers from "./output-parsers.js";
import * as chains from "./chains.js";
import * as memory from "./memory.js";
import * as tools from "./tools.js";
import * as agents from "./agents.js";

type Demo = {
  description: string;
  run: () => void | Promise<void>;
};

export const DEMOS: Record<string, Demo> = {
  chat_models: { description: chatModels.DESCRIPTION, run: chatModels.run },
  prompt_templates: { description: promptTemplates.DESCRIPTION, run: promptTemplates.run },
  output_parsers: { description: outputParsers.DESCRIPTION, run: outputParsers.run },
  chains: { description: chains.DESCRIPTION, run: chains.run },
  memory: { description: memory.DESCRIPTION, run: memory.run },
  tools: { description: tools.DESCRIPTION, run: tools.run },
  agents: { description: agents.DESCRIPTION, run: agents.run },
};