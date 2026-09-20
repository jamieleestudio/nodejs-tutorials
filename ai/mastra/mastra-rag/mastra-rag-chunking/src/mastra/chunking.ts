import { MDocument } from '@mastra/rag';

/**
 * 文档分块：MDocument 支持多种来源（fromText / fromHTML / fromMarkdown / fromJSON）
 * 和多种分块策略（recursive / character / sentence / markdown-section 等）。
 * 块的大小与重叠直接影响检索质量：块太大语义稀释，太小上下文断裂。
 *
 * 本模块纯本地运行，不调用任何模型 —— 分块是 RAG 管道的第一步。
 */
export const sampleDoc = `# Mastra 入门

## 什么是 Mastra
Mastra 是一个 TypeScript 优先的 AI 应用框架，提供 Agent、工具、工作流、记忆和 RAG 等能力。
它构建在 Vercel AI SDK 之上，天然支持流式输出与多种模型提供商。

## Agent
Agent 用自然语言指令定义行为，可挂载工具与记忆。model router 支持 openai、anthropic、deepseek 等数十家提供商，
只需 provider/model 格式的字符串加上对应的环境变量。

## 工作流
工作流用 createWorkflow 与 createStep 声明式地编排步骤，支持分支、并行、挂起与恢复，
适合步骤明确的确定性任务；步骤不确定时用 Agent 自主决策。

## 记忆
记忆分为消息历史、工作记忆与语义召回三层。消息历史保留最近 N 条；
工作记忆是结构化的用户档案；语义召回按向量相似度检索跨会话的历史消息。
`;

export async function runChunking() {
  const doc = MDocument.fromText(sampleDoc, { type: 'markdown' });

  // 策略一：递归分块（最常用）—— 按段落/句子递归切，目标 180 字符，重叠 30
  const recursive = await doc.chunk({
    strategy: 'recursive',
    maxSize: 180,
    overlap: 30,
    separators: ['\n\n'],
  });

  // 每个块都带元数据（来源文档、位置索引等），可附加业务元数据供过滤
  console.log('=== 递归分块（块数:', recursive.length, '）===');
  for (const [i, chunk] of recursive.entries()) {
    console.log(`[chunk ${i}] meta=${JSON.stringify(chunk.metadata)}`);
    console.log(`  text: ${chunk.text.replaceAll('\n', ' ').slice(0, 80)}...`);
  }

  // 策略二：按 Markdown 标题分块 —— 结构化文档推荐，块边界与章节对齐
  const doc2 = MDocument.fromText(sampleDoc, { type: 'markdown' });
  const byHeader = await doc2.chunk({ strategy: 'markdown' });
  console.log('=== Markdown 标题分块（块数:', byHeader.length, '）===');
  for (const [i, chunk] of byHeader.entries()) {
    console.log(`[section ${i}] ${chunk.text.replaceAll('\n', ' ').slice(0, 60)}...`);
  }
}
