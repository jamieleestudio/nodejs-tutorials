import {
  StateGraph,
  Annotation,
  START,
  END,
  MemorySaver,
  interrupt,
  Command,
} from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';
import { createChatModel } from 'langchainjs-shared';

/**
 * 人工介入（HITL）：{@code interrupt()} 在节点内挂起并抛出待确认内容，
 * 进程重启也不丢（MemorySaver checkpoint），用 {@code Command.resume} 恢复 ——
 * 对照 SAA 的 interruptBefore + resume、LangChain4j 的 interruptBefore。
 */
const model = createChatModel();

const GraphState = Annotation.Root({
  request: Annotation<string>,
  refundPlan: Annotation<string>,
  approval: Annotation<string>,
  result: Annotation<string>,
});

async function plan(state: typeof GraphState.State) {
  const r = await model.invoke(
    `为退款请求写一份 50 字以内的处理方案：${state.request}`,
  );
  return { refundPlan: r.content as string };
}

async function humanApproval(state: typeof GraphState.State) {
  // interrupt 挂起：把待审批内容抛给调用方，等待 Command.resume 恢复
  const answer: string = interrupt({
    plan: state.refundPlan,
    question: '是否批准该退款？(yes/no)',
  });
  return { approval: answer };
}

async function finalize(state: typeof GraphState.State) {
  const approved = state.approval.toLowerCase().startsWith('y');
  if (!approved) {
    return { result: '退款已被驳回。' };
  }
  const r = await model.invoke(
    `用一句话告知用户退款已提交（订单信息：${state.request}）。`,
  );
  return { result: r.content as string };
}

const workflow = new StateGraph(GraphState)
  .addNode('plan', plan)
  .addNode('humanApproval', humanApproval)
  .addNode('finalize', finalize)
  .addEdge(START, 'plan')
  .addEdge('plan', 'humanApproval')
  .addEdge('humanApproval', 'finalize')
  .addEdge('finalize', END)
  .compile({ checkpointer: new MemorySaver() });

export { workflow };
