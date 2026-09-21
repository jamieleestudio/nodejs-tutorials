import { Agent } from '@mastra/core/agent';
import { Mastra } from '@mastra/core';

/**
 * 子 Agent（Agent-as-Tool）：构造器的 agents 选项把专家 Agent 注册为可委派工具。
 * 主管按 description 决定委派给谁；委派时子 Agent 的记忆自动隔离
 * （每次委派新 thread，resource 按 {parent}-{agentName} 稳定隔离）。
 */
export const translator = new Agent({
  id: 'translator',
  name: 'Translator',
  description: '中英翻译专家：把文本在中译英或英译中',
  instructions: '你是专业译者。直接输出译文，不要解释。',
  model: 'deepseek/deepseek-chat',
});

export const summarizer = new Agent({
  id: 'summarizer',
  name: 'Summarizer',
  description: '摘要专家：把长文本压缩成一句话摘要',
  instructions: '你是摘要专家。输出一句话中文摘要，不超过 40 字。',
  model: 'deepseek/deepseek-chat',
});

export const coordinator = new Agent({
  id: 'coordinator',
  name: 'Coordinator',
  description: '任务协调主管',
  instructions: `
    你是任务主管。根据用户请求委派合适的专家（translator/summarizer）完成任务，
    拿到专家结果后原样输出给用户，不要自己翻译或摘要。
  `,
  model: 'deepseek/deepseek-chat',
  agents: { translator, summarizer },
});

