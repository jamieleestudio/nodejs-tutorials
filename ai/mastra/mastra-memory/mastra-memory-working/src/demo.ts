import { mastra } from './mastra/index.ts';

const agent = mastra.getAgentById('working-memory-agent');
const memoryOpts = { memory: { resource: 'user-42', thread: 'session-1' } } as const;

// 第 1 轮：告知个人信息（agent 自动写入 working memory）
const r1 = await agent.generate('你好！我叫小李，最喜欢 Java，最近在学 Mastra。', memoryOpts);
console.log('[round1]', r1.text);

// 第 2 轮（同 resource）：换一个全新 thread —— working memory 是 resource 级的，跨线程生效
const r2 = await agent.generate('我叫什么名字？最喜欢什么技术？', {
  memory: { resource: 'user-42', thread: 'session-2' },
});
console.log('[round2 / 新线程]', r2.text);
