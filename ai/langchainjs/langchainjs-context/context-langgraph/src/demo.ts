import { StateGraph, Annotation, START, END } from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';
import { createChatModel } from 'langchainjs-shared';

/**
 * LangGraph 图内透传：invoke 时传 configurable（用户/租户），
 * 节点签名 (state, config) 读取，图内工具经 ToolNode 同样可读 ——
 * 对照 SAA Graph 的状态透传。config 沿图传播，无需手动层层传参。
 */
const model = createChatModel();

const GraphState = Annotation.Root({
  question: Annotation<string>,
  answer: Annotation<string>,
});

// 节点：读 config.configurable 里的用户上下文，生成个性化回答
async function answerNode(state: typeof GraphState.State, config: { configurable?: { userId?: string; role?: string } }) {
  const userId = config.configurable?.userId ?? 'anonymous';
  const role = config.configurable?.role ?? 'guest';
  const r = await model.invoke(
    `当前用户 ${userId}（角色 ${role}）提问：${state.question}\n回答一句话，可提及用户身份。`,
  );
  return { answer: r.content as string };
}

const workflow = new StateGraph(GraphState)
  .addNode('generate', answerNode)
  .addEdge(START, 'generate')
  .addEdge('generate', END)
  .compile();

async function main(): Promise<void> {
  const config = { configurable: { userId: 'u-1001', role: 'admin' } };
  const r1 = await workflow.invoke({ question: '我能管理其他用户吗？' }, config);
  console.log('[admin]', typeof r1.answer === 'string' ? r1.answer : '');

  const config2 = { configurable: { userId: 'u-1002', role: 'member' } };
  const r2 = await workflow.invoke({ question: '我能管理其他用户吗？' }, config2);
  console.log('[member]', typeof r2.answer === 'string' ? r2.answer : '');
}

main();
