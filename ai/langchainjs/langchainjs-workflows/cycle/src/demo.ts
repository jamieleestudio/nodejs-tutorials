import { StateGraph, Annotation, START, END } from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';
import { createChatModel } from 'langchainjs-shared';

/**
 * 循环工作流：generate → review → 条件回边（最多 3 轮）——
 * 条件函数里用轮次计数器封顶，防止无限循环。
 */
const model = createChatModel();

const maxRounds = 3;

const GraphState = Annotation.Root({
  topic: Annotation<string>,
  draft: Annotation<string>,
  feedback: Annotation<string>,
  round: Annotation<number>,
});

async function generate(state: typeof GraphState.State) {
  const prompt = state.round === 0
    ? `围绕 {{topic}} 写一段 60 字左右的短文：${state.topic}`
    : `根据反馈修改下面的短文（第 ${state.round + 1} 轮）：\n${state.draft}\n反馈：${state.feedback}`;
  const r = await model.invoke(prompt);
  return { draft: r.content as string, round: state.round + 1 };
}

async function review(state: typeof GraphState.State) {
  const r = await model.invoke(
    `评审下面的短文，若已合格输出 PASS，否则给一句修改建议：\n${state.draft}`,
  );
  return { feedback: r.content as string };
}

function shouldContinue(state: typeof GraphState.State): 'generate' | END {
  if (state.round >= maxRounds) return END;
  if (String(state.feedback).includes('PASS')) return END;
  return 'generate';
}

const workflow = new StateGraph(GraphState)
  .addNode('generate', generate)
  .addNode('review', review)
  .addEdge(START, 'generate')
  .addEdge('generate', 'review')
  .addConditionalEdges('review', shouldContinue, { generate: 'generate', [END]: END })
  .compile();

async function main(): Promise<void> {
  const result = await workflow.invoke({ topic: 'AI 编程助手', round: 0 });
  console.log('[轮数]', result.round);
  console.log('[终稿]', result.draft);
}

main();