import { z } from 'zod';
import { mastra } from '../mastra/index.ts';

// 与 Java 侧 generate({ output: zodSchema }) 对照：Spring AI 的 entity(Class)
// 与 Mastra 的 output schema 同一范式 —— 模型直接产出强类型对象。
const movieInfo = z.object({
  title: z.string(),
  year: z.number(),
  director: z.string(),
  genre: z.string(),
  rating: z.number(),
});

const agent = mastra.getAgentById('extract-agent');
const response = await agent.generate('介绍电影《肖申克的救赎》', { structuredOutput: { schema: movieInfo } });

console.log('类型化结果:', response.object);
console.log('标题:', response.object.title);
console.log('年份:', response.object.year);

// 列表结构化输出
const movies = z.object({
  items: z.array(
    z.object({
      title: z.string(),
      year: z.number(),
    }),
  ),
});

const listResponse = await agent.generate('列出三部经典科幻电影', { structuredOutput: { schema: movies } });
console.log('列表结果:', listResponse.object.items);
