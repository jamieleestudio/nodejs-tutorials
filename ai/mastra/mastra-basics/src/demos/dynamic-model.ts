import { mastra } from '../mastra/index.ts';
import { RequestContext } from '@mastra/core/request-context';

const agent = mastra.getAgentById('dynamic-agent');

// 普通对话：走 deepseek-chat
const ctx = new RequestContext();
ctx.set('task-type', 'chat');
const chat = await agent.generate('用一句话介绍 Node.js', { requestContext: ctx });
console.log('[chat/deepseek-chat]', chat.text);

// 复杂推理：走 deepseek-reasoner
const ctx2 = new RequestContext();
ctx2.set('task-type', 'reasoning');
const reasoning = await agent.generate('9.11 和 9.9 哪个大？说明理由', { requestContext: ctx2 });
console.log('[reasoning/deepseek-reasoner]', reasoning.text);
