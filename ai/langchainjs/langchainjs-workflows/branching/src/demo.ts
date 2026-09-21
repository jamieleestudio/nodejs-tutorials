import { StateGraph, Annotation, START, END } from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';
import { createChatModel } from 'langchainjs-shared';

/**
 * 分支路由：addConditionalEdges 按状态谓词选择执行路径 ——
 * 对照 SAA 的 conditional edges / Mastra 的 branch。
 */
const model = createChatModel();

const GraphState = Annotation.Root({
  input: Annotation<string>,
  lane: Annotation<string>,
  answer: Annotation<string>,
});

async function classify(state: typeof GraphState.State) {
  const r = await model.invoke(
    `把问题分类为 tech / general 两类之一，只输出类名：\n${state.input}`,
  );
  const lane = String(r.content).trim().toLowerCase().startsWith('tech') ? 'tech' : 'general';
  return { lane };
}

async function techExpert(state: typeof GraphState.State) {
  const r = await model.invoke(`用技术视角简要回答：${state.input}`);
  return { answer: r.content as string };
}

async function generalExpert(state: typeof GraphState.State) {
  const r = await model.invoke(`用通俗语言简要回答：${state.input}`);
  return { answer: r.content as string };
}

const workflow = new StateGraph(GraphState)
  .addNode('classify', classify)
  .addNode('tech', techExpert)
  .addNode('general', generalExpert)
  .addEdge(START, 'classify')
  .addConditionalEdges('classify', (state) => state.lane, {
    tech: 'tech',
    general: 'general',
  })
  .addEdge('tech', END)
  .addEdge('general', END)
  .compile();

async function main(): Promise<void> {
  const result = await workflow.invoke({
    input: 'LangGraph 的状态图和普通的函数调用链有什么区别？',
  });
  console.log('[lane]', result.lane);
  console.log('[answer]', result.answer);
}

main();