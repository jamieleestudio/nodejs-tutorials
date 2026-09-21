import { Agent } from '@mastra/core/agent';
import { Mastra } from '@mastra/core';
import { LibSQLStore } from '@mastra/libsql';
import { createAnswerRelevancyScorer } from '@mastra/evals/scorers/prebuilt';
import { checks } from '@mastra/evals/checks';

/**
 * 评估（Scorers）：
 * - answer relevancy：模型评分器（用 deepseek 当裁判），衡量回答与问题的相关性，0-1 分
 * - checks.includes：规则评分器，断言输出包含某段文本（确定性，无 LLM 成本）
 *
 * scorer 可挂在 Agent 上做实时评估（sampling 控制采样率），
 * 分数自动写入 storage 的 mastra_scorers 表，Studio 的 Observability 面板可查看。
 */
export const evaluatedAgent = new Agent({
  id: 'evaluated-agent',
  name: 'Evaluated Agent',
  instructions: '你是知识助手，回答必须包含"Mastra"这个关键词，回答简短。',
  model: 'deepseek/deepseek-chat',
  scorers: {
    relevancy: {
      scorer: createAnswerRelevancyScorer({ model: 'deepseek/deepseek-chat' }),
      sampling: { type: 'ratio', rate: 1 },
    },
  },
});

