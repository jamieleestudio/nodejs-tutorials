import {
  StateGraph,
  Annotation,
  START,
  END,
  MemorySaver,
} from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';
import { createChatModel } from 'langchainjs-shared';

/**
 * 持久化：MemorySaver checkpointer + thread_id ——
 * 同一线程的多次 invoke 共享状态（对照 SAA 的 checkpoint threadId）。
 * 生产换 SqliteSaver/PostgresSaver 等持久化 checkpointer。
 */
const model = createChatModel();

const GraphState = Annotation.Root({
  message: Annotation<string>,
  history: Annotation<string[]>({
    reducer: (a, b) => a.concat(b),
    default: () => [],
  }),
});

async function chat(state: typeof GraphState.State) {
  const r = await model.invoke(
    state.history.length === 0
      ? state.message
      : `结合历史回答：\n${state.history.join('\n')}\n当前：${state.message}`,
  );
  return {
    history: [`用户: ${state.message}`, `助手: ${String(r.content)}`],
  };
}

const workflow = new StateGraph(GraphState)
  .addNode('chat', chat)
  .addEdge(START, 'chat')
  .addEdge('chat', END)
  .compile({ checkpointer: new MemorySaver() });

const config = { configurable: { thread_id: 'demo-thread' } };

async function main(): Promise<void> {
  const r1 = await workflow.invoke({ message: '你好，我叫小李' }, config);
  console.log('[round1]', JSON.stringify(r1.history?.slice(-1)));

  const r2 = await workflow.invoke(
    { message: '我叫什么名字？' },
    config,
  );
  console.log('[round2]', JSON.stringify(r2.history?.slice(-1)));
}

main();
