import { ChatOpenAI } from '@langchain/openai';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import { createChatModel } from 'langchainjs-shared';

/**
 * ChatModel 基础：invoke() + 消息类型（System/Human/AI）。
 * 对照 Java 侧 langchain4j-chat 的 ChatModel.chat(String)。
 */
async function main(): Promise<void> {
  const model = createChatModel();

  console.log('- model:', model.model ?? 'deepseek-chat');
  console.log('- sending SystemMessage + HumanMessage...');

  const response = await model.invoke([
    new SystemMessage('你是一个简洁的助手。用一句话回答。'),
    new HumanMessage('什么是 Node.js？'),
  ]);

  console.log('- AI:', typeof response.content === 'string' ? response.content : JSON.stringify(response.content));
  console.log('- response metadata:', JSON.stringify(response.response_metadata?.model_name ?? ''));
}

main();
