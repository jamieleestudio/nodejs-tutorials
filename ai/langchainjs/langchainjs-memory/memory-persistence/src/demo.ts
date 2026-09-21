import { ChatOpenAI } from '@langchain/openai';
import { BaseListChatMessageHistory, BaseMessage } from '@langchain/core/chat_history';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { RunnableWithMessageHistory } from '@langchain/core/runnables';
import fs from 'node:fs';
import { createChatModel } from 'langchainjs-shared';

/**
 * 记忆持久化：自定义 {@code BaseListChatMessageHistory} 把历史落到本地 JSON 文件，
 * 同一 sessionId 重启进程后历史仍在 —— 对照 Java 侧 ChatMemoryStore 落盘。
 */
const FILE = 'memory-history.json';

class FileChatMessageHistory extends BaseListChatMessageHistory {
  private messages: BaseMessage[] = [];

  constructor(readonly sessionId: string) {
    super();
    if (fs.existsSync(FILE)) {
      const all = JSON.parse(fs.readFileSync(FILE, 'utf8')) as Record<string, BaseMessage[]>;
      for (const m of all[sessionId] ?? []) {
        this.messages.push(m);
      }
    }
  }

  override async getMessages(): Promise<BaseMessage[]> {
    return this.messages;
  }

  override async addMessage(message: BaseMessage): Promise<void> {
    this.messages.push(message);
    const all = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, 'utf8')) : {};
    all[this.sessionId] = this.messages;
    fs.writeFileSync(FILE, JSON.stringify(all, null, 2));
  }

  override async clear(): Promise<void> {
    this.messages = [];
    const all = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, 'utf8')) : {};
    delete all[this.sessionId];
    fs.writeFileSync(FILE, JSON.stringify(all, null, 2));
  }
}

const model = createChatModel();

const prompt = ChatPromptTemplate.fromMessages([
  ['system', '你是友好的助手，记住用户告诉你的信息。'],
  new MessagesPlaceholder('chat_history'),
  ['human', '{message}'],
]);

const withHistory = new RunnableWithMessageHistory({
  runnable: prompt.pipe(model),
  getMessageHistory: (sessionId: string) => new FileChatMessageHistory(sessionId),
  inputMessagesKey: 'message',
  historyMessagesKey: 'chat_history',
});

const mode = process.argv[2] ?? 'write';

async function main(): Promise<void> {
  const config = { configurable: { sessionId: 'durable-session' } };
  if (mode === 'write') {
    const r = await withHistory.invoke(
      { message: '记住：团队代号是 NightOwl' },
      config,
    );
    console.log('[写入]', typeof r.content === 'string' ? r.content : '');
    console.log('历史已落盘 memory-history.json，用 `npx tsx src/demo.ts read` 重启后验证。');
  } else {
    const r = await withHistory.invoke(
      { message: '团队代号是什么？' },
      config,
    );
    console.log('[重启后读取]', typeof r.content === 'string' ? r.content : '');
  }
}

main();
