import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { InMemoryChatMessageHistory } from '@langchain/core/chat_history';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { RunnableWithMessageHistory } from '@langchain/core/runnables';
import { createChatModel } from 'langchainjs-shared';

/**
 * 会话历史：RunnableWithMessageHistory + MessagesPlaceholder('chat_history')。
 * 框架自动把历史消息注入 prompt 的 chat_history 槽位、并在每轮后追加新消息
 * —— 对照 Java 侧 ChatMemory + memoryId。
 */
const historyBySession = new Map<string, InMemoryChatMessageHistory>();

function historyFor(sessionId: string): InMemoryChatMessageHistory {
  if (!historyBySession.has(sessionId)) {
    historyBySession.set(sessionId, new InMemoryChatMessageHistory());
  }
  return historyBySession.get(sessionId)!;
}

const model = createChatModel();

const prompt = ChatPromptTemplate.fromMessages([
  ['system', '你是友好的助手，记住用户告诉你的信息。'],
  new MessagesPlaceholder('chat_history'),
  ['human', '{message}'],
]);

const withHistory = new RunnableWithMessageHistory({
  runnable: prompt.pipe(model),
  getMessageHistory: (sessionId: string) => historyFor(sessionId),
  inputMessagesKey: 'message',
  historyMessagesKey: 'chat_history',
});

async function main(): Promise<void> {
  const config = { configurable: { sessionId: 'session-1' } };

  const r1 = await withHistory.invoke(
    { message: '你好，我叫小李，最喜欢 Java' },
    config,
  );
  console.log('[round1]', typeof r1.content === 'string' ? r1.content : '');

  const r2 = await withHistory.invoke(
    { message: '我叫什么名字？最喜欢什么技术？' },
    config,
  );
  console.log('[round2]', typeof r2.content === 'string' ? r2.content : '');
}

main();
