import {
  StateGraph,
  Annotation,
  START,
  END,
  MemorySaver,
  interrupt,
  Command,
} from '@langchain/langgraph';
import { z } from 'zod';
import { createChatModel } from 'langchainjs-shared';

/**
 * 人工介入（HITL）：{@code interrupt()} 在节点内挂起并抛出待确认内容，
 * 进程重启也不丢（MemorySaver checkpoint），用 {@code Command.resume} 恢复 ——
 * 对照 SAA 的 interruptBefore + resume、LangChain4j 的 interruptBefore。
 *
 * langgraph 1.x 新特性（本模块升级后演示）：
 * 1. {@code responseSchema}：给 interrupt 声明恢复值的 Zod schema——运行时校验并解析
 *    恢复值（interrupt 返回的就是解析后的对象），同时以 JSON Schema 暴露给客户端渲染表单；
 * 2. 同一节点内多次 {@code interrupt()}：按顺序依次挂起/恢复（见 humanApproval 的驳回分支）。
 */
const model = createChatModel();

/** 审批表单：interrupt 的 responseSchema 会校验 Command.resume 的值 */
const ApprovalSchema = z.object({
  approved: z.boolean().describe('是否批准'),
  comment: z.string().optional().describe('审批意见'),
});

/** 驳回追问表单：驳回原因分类 + 补充说明 */
const RejectionSchema = z.object({
  category: z.enum(['evidence', 'policy', 'budget']).describe('驳回原因分类'),
  note: z.string().describe('补充说明'),
});

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
  // 第一次 interrupt：恢复值必须是 { approved, comment? }，Zod 校验 + 解析
  const approval: z.infer<typeof ApprovalSchema> = interrupt(
    { plan: state.refundPlan, question: '是否批准该退款？' },
    { responseSchema: ApprovalSchema },
  );
  if (approval.approved) {
    return { approval: `批准（${approval.comment ?? '无意见'}）` };
  }
  // 第二次 interrupt（同一节点，langgraph 1.x 支持顺序多次）：追问驳回原因
  const rejection: z.infer<typeof RejectionSchema> = interrupt(
    { question: '请选择驳回原因分类', plan: state.refundPlan },
    { responseSchema: RejectionSchema },
  );
  return { approval: `驳回（${rejection.category}：${rejection.note}）` };
}

async function finalize(state: typeof GraphState.State) {
  const approved = state.approval.startsWith('批准');
  if (!approved) {
    return { result: `退款已被驳回。${state.approval}` };
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
