import { mastra } from './mastra/index.ts';

const coordinator = mastra.getAgentById('coordinator');

// 委派 summarizer
const r1 = await coordinator.generate(
  '帮我总结一下：Mastra 把 Agent、工具、工作流、记忆和 RAG 统一成一套 TypeScript 框架，让 Node.js 开发者可以用声明式的方式构建 AI 应用。',
);
console.log('[summarizer]', r1.text);

// 委派 translator
const r2 = await coordinator.generate('把这句话翻译成英文：图编排让大模型工作流可视化');
console.log('[translator]', r2.text);
