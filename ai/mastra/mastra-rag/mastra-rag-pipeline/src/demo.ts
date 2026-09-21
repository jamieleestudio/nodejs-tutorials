import { mastra, ensureKnowledge } from './mastra/index.ts';

await ensureKnowledge();

const agent = mastra.getAgentById('rag-agent');
const r = await agent.generate('Graph 框架怎么做人工审批？');
console.log('[回答]', r.text);
