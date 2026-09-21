import { mastra } from '../mastra/index.ts';

const agent = mastra.getAgentById('chat-agent');
const response = await agent.generate('用一句话介绍 Mastra 框架');
console.log(response.text);
