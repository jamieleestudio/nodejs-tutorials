import { mastra } from './mastra/index.ts';

const agent = mastra.getAgentById('tool-agent');

const response = await agent.generate('杭州今天天气怎么样？另外帮我算一下 128 乘以 6');
console.log('回答:', response.text);
console.log('工具调用数:', response.toolCalls?.length ?? 0);
console.log(
  '工具结果:',
  JSON.stringify(
    (response.toolResults ?? []).map((r: { payload?: unknown }) => r.payload ?? r),
  ),
);
