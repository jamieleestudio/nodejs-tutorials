import { mastra } from '../mastra/index.ts';

const agent = mastra.getAgentById('recall-agent');
const memoryOpts = { memory: { resource: 'user-42', thread: 'long-session' } } as const;

// 第一阶段：埋入一些信息（会被向量化存入语义索引）
const topics = [
  '我打算用 PostgreSQL 存储订单数据',
  '我们的消息队列选型是 RocketMQ',
  '前端框架我们用的 Vue 3',
  '部署环境是 Kubernetes 集群',
];
for (const t of topics) {
  await agent.generate(t, memoryOpts);
  console.log('已写入:', t);
}

// 第二阶段：语义召回 —— 不需要精确关键词，按语义命中历史消息
const q = await agent.generate('我们的数据库选型是什么来着？', memoryOpts);
console.log('[召回回答]', q.text);
