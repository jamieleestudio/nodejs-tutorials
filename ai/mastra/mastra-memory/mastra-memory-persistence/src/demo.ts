import { mastra } from './mastra/index.ts';

const agent = mastra.getAgentById('persistent-agent');
const memoryOpts = { memory: { resource: 'user-42', thread: 'durable-thread' } } as const;

const mode = process.argv[2] ?? 'write';

if (mode === 'write') {
  const r = await agent.generate('记住：我们团队的代号是 NightOwl', memoryOpts);
  console.log('[写入]', r.text);
  console.log('数据已落盘 persistent-memory.db。现在可以用 `npx tsx src/demo.ts read` 重启进程后读取。');
} else {
  // read：新的进程实例，LibSQLStore 从文件恢复全部历史
  const r = await agent.generate('我们团队的代号是什么？', memoryOpts);
  console.log('[重启后读取]', r.text);
}
