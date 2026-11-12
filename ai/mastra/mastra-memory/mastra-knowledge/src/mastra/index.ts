import { Agent } from '@mastra/core/agent';
import { Knowledge } from '@mastra/core/knowledge';
import { Mastra } from '@mastra/core';
import { LibSQLStore } from '@mastra/libsql';

/**
 * Knowledge v2（@mastra/core 1.82 新特性，实验性）：
 * 带**访问控制**的页式知识库——scope（如 `org:acme`）→ 页面树（`scope#path`）→ 笔记，
 * 挂到 Agent 后自动注入 knowledge_search / knowledge_read / knowledge_page / knowledge_note
 * 工具与使用说明，运行按 scopes 决定「我是谁、能读哪些页」。
 * 不配 vector/embedder 时检索为关键词匹配（配了则混合语义检索）。
 */
export const productKnowledge = new Knowledge({
  name: '产品知识库',
  description: 'SaaS 产品的退款政策、SLA 等运营口径文档',
  scopes: {
    // scope 声明：模式 `org:$orgId` 匹配运行时的 `org:acme` 等具体地址；
    // principal: 'self' = 持有该 scope 的运行在本 scope 上获得 editor 角色
    'org:$orgId': {
      description: '组织级文档（每个租户一份）',
      displayLabel: '组织',
      access: [{ principal: 'self', role: 'editor' }],
    },
  },
  storage: new LibSQLStore({ id: 'knowledge-storage', url: 'file:knowledge.db' }),
  // 给挂载的 Agent 注入知识工具（true = 读 + 写；也可 { read: true } 只读）
  tools: true,
});

export const docsAgent = new Agent({
  id: 'docs-agent',
  name: 'Docs Agent',
  instructions: `
    你是产品文档助手。回答口径类问题前，先用 knowledge_search 在知识库中检索，
    再基于 knowledge_read 的内容回答；知识库没有依据时明确说不知道。
  `,
  model: 'deepseek/deepseek-chat',
  // Knowledge v2：Agent 直接挂 Knowledge 实例（或 Mastra 上注册的 key），无需 Memory
  knowledge: productKnowledge,
  // 运行身份：本 Agent 的每次运行都携带 org:acme scope（对应上面的 org:$orgId 声明）
  scopes: ['org:acme'],
});

export const mastra = new Mastra({
  agents: { docsAgent },
  knowledge: { productKnowledge },
  server: { port: 8627 },
});
