import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { z } from 'zod';
import { createChatModel } from 'langchainjs-shared';

/**
 * 输出解析器：StringOutputParser（纯文本）与 zod 结构化输出。
 * 对照 Java 侧 AiServices 返回 POJO / 结构化输出。
 */
async function main(): Promise<void> {
  const model = createChatModel();
  const prompt = ChatPromptTemplate.fromMessages([
    ['system', '你是一个简洁的助手。'],
    ['human', '{question}'],
  ]);

  // 1. StringOutputParser：AIMessage → string
  const chain = prompt.pipe(model).pipe(new StringOutputParser());
  const text = await chain.invoke({ question: '什么是 TypeScript？' });
  console.log('- string output:', text);

  // 2. withStructuredOutput：zod schema → 强类型对象
  const structuredModel = model.withStructuredOutput(
    z.object({
      title: z.string().describe('电影名'),
      year: z.number().describe('上映年份'),
      genre: z.string().describe('类型'),
    }),
  );
  const movie = await structuredModel.invoke('介绍电影《肖申克的救赎》的基本信息');
  console.log('- structured output:', JSON.stringify(movie, null, 2));
}
