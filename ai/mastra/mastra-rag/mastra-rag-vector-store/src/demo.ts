import { ingest, search } from './mastra/vector-store.ts';

await ingest();

const queries = ['如何声明一个工作流？', '数据库怎么选型？'];
for (const q of queries) {
  console.log(`\n查询: ${q}`);
  const results = await search(q, 2);
  for (const r of results) {
    const meta = r.metadata as { text?: string; source?: string };
    console.log(`  [score=${r.score?.toFixed(4)} source=${meta?.source}] ${meta?.text}`);
  }
}
