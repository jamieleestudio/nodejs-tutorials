import { StateGraph, Annotation, START, END } from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage } from '@langchain/core/messages';
import { createChatModel } from 'langchainjs-shared';

/**
 * StateGraph 基础：Annotation 定义状态（reducer 合并策略）、
 * 节点函数返回状态增量、START/END 与边定义执行路径 ——
 * 对照 Java 侧 SAA 的 StateGraph / Mastra 的 workflow。
 */
const model = createChatModel();

const GraphState = Annotation.Root({
  topic: Annotation<string>,
  keywords: Annotation<string>,
  article: Annotation<string>,
});

async function extract(state: typeof GraphState.State) {
  const r = await model.invoke(`从下面的文本提取 2 个关键词，用顿号分隔，只输出关键词：\n${state.topic}`);
  return { keywords: r.content as string };
}

async function write(state: typeof GraphState.State) {
  const r = await model.invoke(`围绕关键词写一段 60 字左右的中文短文：${state.keywords}`);
  return { article: r.content as string };
}

const workflow = new StateGraph(GraphState)
  .addNode('extract', extract)
  .addNode('write', write)
  .addEdge(START, 'extract')
  .addEdge('extract', 'write')
  .addEdge('write', END)
  .compile();

async function main(): Promise<void> {
  const result = await workflow.invoke({
    topic: 'Spring AI Alibaba 让 Java 开发者用图编排大模型工作流',
  });
  console.log('[keywords]', result.keywords);
  console.log('[article]', result.article);
}

main();
