import { StateGraph, Annotation, START, END, Send } from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';
import { createChatModel } from 'langchainjs-shared';

/**
 * 并行 map-reduce：Send API 把同一节点按列表扇出为多实例并发执行，
 * 全部完成后进入汇聚节点 —— 对照 SAA 的 parallel edges。
 */
const model = createChatModel();

const GraphState = Annotation.Root({
  topics: Annotation<string[]>,
  reviews: Annotation<{ topic: string; review: string }[]>({
    reducer: (a, b) => a.concat(b),
    default: () => [],
  }),
});

const topicsToSends = (state: typeof GraphState.State) =>
  state.topics.map((topic) => new Send('reviewOne', { topic }));

async function reviewOne(state: { topic: string }) {
  const r = await model.invoke(`一句话点评「${state.topic}」的可行性。`);
  return { reviews: [{ topic: state.topic, review: String(r.content) }] };
}

async function merge(state: typeof GraphState.State) {
  const joined = state.reviews.map((r) => `${r.topic}：${r.review}`).join('\n');
  const r = await model.invoke(`汇总以下评审（两句话以内）：\n${joined}`);
  return { reviews: state.reviews, summary: r.content as string };
}

const GraphState2 = Annotation.Root({
  topics: Annotation<string[]>,
  reviews: Annotation<{ topic: string; review: string }[]>({
    reducer: (a, b) => a.concat(b),
    default: () => [],
  }),
  summary: Annotation<string>,
});

const workflow = new StateGraph(GraphState2)
  .addNode('reviewOne', reviewOne)
  .addNode('merge', merge)
  .addConditionalEdges(START, topicsToSends, { reviewOne: 'reviewOne' })
  .addEdge('reviewOne', 'merge')
  .addEdge('merge', END)
  .compile();

async function main(): Promise<void> {
  const result = await workflow.invoke({
    topics: ['AI 编程助手', '企业知识库问答'],
  });
  console.log('[评审明细]');
  for (const r of result.reviews) {
    console.log(`- ${r.topic}：${r.review}`);
  }
  console.log('[汇总]', result.summary);
}

main();
