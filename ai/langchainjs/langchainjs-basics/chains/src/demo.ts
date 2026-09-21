import { ChatPromptTemplate } from '@langchain/core/prompts';
import { RunnableLambda, RunnablePassthrough } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { createChatModel } from 'langchainjs-shared';

/**
 * LCEL 链：prompt | model | parser 的管道组合，以及
 * RunnableLambda（自定义逻辑）、RunnablePassthrough（透传分支）。
 * LCEL 是 LangChain.js 的招牌 —— 对照 Java 侧的 AiServices 声明式接口。
 */
async function main(): Promise<void> {
  const model = createChatModel();

  // 1. 经典三段链：prompt → model → parser
  const chain = ChatPromptTemplate.fromMessages([
    ['system', '你是简洁的 {style} 风格助手。'],
    ['human', '{question}'],
  ])
    .pipe(model)
    .pipe(new StringOutputParser());

  const answer = await chain.invoke({ style: '技术', question: 'LCEL 解决什么问题？' });
  console.log('- chain output:', answer);

  // 2. RunnableLambda：链中插入自定义逻辑（预处理/后处理）
  const withPreprocess = RunnableLambda.from((q: string) => q.toUpperCase())
    .pipe(chain);
  const preprocessed = await withPreprocess.invoke('langgraph 和 langchain 的关系');
  console.log('- with lambda:', preprocessed);

  // 3. RunnablePassthrough.assign：透传输入并追加字段（多参数场景）
  const passthrough = RunnablePassthrough.assign({
    upper: (input: { question: string }) => input.question.toUpperCase(),
  });
  console.log('- passthrough:', JSON.stringify(await passthrough.invoke({ question: 'hello' })));
}

main();
