import { mastra } from '../mastra/index.ts';

const supervisor = mastra.getAgentById('supervisor');

// 委派 summarizer
const r1 = await supervisor.generate(
  '帮我总结一下：Mastra 是一个 TypeScript 优先的 AI 框架，统一了 Agent、工具、工作流与记忆的开发体验。',
);
console.log('[summarizer]', r1.text);

// 委派 translator
const r2 = await supervisor.generate('把翻译成英文：记忆让 Agent 拥有长期上下文');
console.log('[translator]', r2.text);
