import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { Mastra } from '@mastra/core';
import { LibSQLStore } from '@mastra/libsql';

/**
 * 主管模式（Supervisor）：构造器的 agents 选项注册 subagents，
 * 主管按 description 自动委派（Agent-as-Tool），委派链上的审批请求会向上传播。
 * 与 java 侧 SubAgentInterceptor / HarnessGateway 的 Supervisor 同一模式。
 */
export const translator = new Agent({
  id: 'translator',
  name: 'Translator',
  description: '中英翻译专家',
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

export const supervisor = new Agent({
  id: 'supervisor',
  name: 'Supervisor',
  description: '任务协调主管',
  instructions: `
    你是任务主管。根据用户请求委派合适的专家（translator/summarizer）完成任务，
    拿到专家结果后原样输出给用户，不要自己翻译或摘要。
  `,
  model: 'deepseek/deepseek-chat',
  agents: { translator, summarizer },
  // 主管通常配记忆：委派链的上下文与审批恢复都依赖 memory + storage
  memory: new Memory({ options: { lastMessages: 10 } }),
});

