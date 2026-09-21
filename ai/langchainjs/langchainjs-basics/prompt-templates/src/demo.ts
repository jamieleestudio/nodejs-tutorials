import { ChatPromptTemplate, PromptTemplate } from '@langchain/core/prompts';
import { createChatModel } from 'langchainjs-shared';

/**
 * 提示词模板：ChatPromptTemplate（聊天消息插值）与 PromptTemplate（纯文本）。
 * 对照 Java 侧 langchain4j 的 @UserMessage("{{text}}") 模板注解。
 */
async function main(): Promise<void> {
  const model = createChatModel();

  // 1. ChatPromptTemplate：system + human 双角色插值
  const prompt = ChatPromptTemplate.fromMessages([
    ['system', '你是一个精通 {topic} 的专家助手，回答一句话。'],
    ['human', '{question}'],
  ]);
  const formatted = await prompt.formatMessages({
    topic: '数据库',
    question: '索引为什么能加速查询？',
  });
  console.log('- formatted messages:', formatted.length);

  // 2. 模板 + 模型直连
  const chain = prompt.pipe(model);
  const result = await chain.invoke({
    topic: '数据库',
    question: '索引为什么能加速查询？',
  });
  console.log('- AI:', typeof result.content === 'string' ? result.content : '');

  // 3. 纯文本模板（非对话场景）
  const template = PromptTemplate.fromTemplate('给 "{product}" 起一个朗朗上口的中文广告语。');
  const text = await template.format({ product: '机械键盘' });
  console.log('- formatted text:', text);
}

main();
