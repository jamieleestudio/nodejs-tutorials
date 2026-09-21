import { Agent } from '@mastra/core/agent';

/**
 * 最小聊天 Agent：model router 原生支持 DeepSeek（deepseek/* 前缀 + DEEPSEEK_API_KEY），
 * 无需手写 base-url 与 provider 对象 —— 与 Java 侧 spring-ai 组的 OpenAI 兼容配置对照。
 */
export const chatAgent = new Agent({
  id: 'chat-agent',
  name: 'Chat Agent',
  instructions: `
    你是一个精通 Java、Node.js 与大模型应用开发的助手。
    回答简洁专业，默认使用中文。
`,
  model: 'deepseek/deepseek-chat',
});
