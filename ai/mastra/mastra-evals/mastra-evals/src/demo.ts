import { mastra } from './mastra/index.ts';

const agent = mastra.getAgentById('evaluated-agent');

// 触发一次调用：relevancy scorer 实时异步评分（rate=1 全量采样），
// 分数落库 evals.db 的 mastra_scorers 表，可在 Studio 的 Observability 面板查看。
const r = await agent.generate('Mastra 是什么？');
console.log('[回答]', r.text);
console.log('\n评分已异步写入：可运行 npx mastra dev 打开 Studio → Observability 查看分数与理由。');

// 规则评分器（checks.includes）同样已注册到 Mastra 实例，
// 可通过 runEvals 或 Studio 的 Evaluate 标签页批量运行。
