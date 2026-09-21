import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { createTool } from '@mastra/core/tools';
import { Mastra } from '@mastra/core';
import { LibSQLStore, LibSQLVector } from '@mastra/libsql';
import { createVectorQueryTool } from '@mastra/rag';
import { embedMany } from 'ai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { z } from 'zod';

/**
 * 端到端智能客服（Mastra 版）：
 *   RAG 知识库（vector query tool）+ 订单工具 + 会话记忆 + 敏感操作人工审批。
 *
 * 对照 Java 侧 capstone：Graph 用 interruptBefore 挂起，Mastra 用
 * 工具的 requireApproval —— 审批粒度到单次工具调用，快照由 storage 承载。
 */

// ---------- 嵌入与知识库 ----------
export const embedder = createOpenAICompatible({
  name: 'dashscope',
  baseURL: process.env.EMBEDDING_BASE_URL ?? 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  apiKey: process.env.DASHSCOPE_API_KEY ?? '',
}).textEmbeddingModel(process.env.EMBEDDING_MODEL ?? 'text-embedding-v3');

export const vectorStore = new LibSQLVector({
  id: 'capstone-vector-store',
  url: 'file:capstone-knowledge.db',
});

const knowledge = [
  '会员权益：基础版 99 元/月，专业版 299 元/月，均可随时取消。',
  '发货时效：现货商品 48 小时内发货，默认顺丰快递。',
  '退款政策：签收后 7 天内可无理由退款，需商品完好。',
];

export async function ensureKnowledge() {
  const { embeddings } = await embedMany({
    values: knowledge,
    model: embedder,
  });
  await vectorStore.upsert({
    indexName: 'faq',
    vectors: embeddings as number[][],
    metadata: knowledge.map((text) => ({ text })),
    ids: knowledge.map((_, i) => `faq-${i}`),
  });
}

// ---------- 工具 ----------
const faqTool = createVectorQueryTool({
  id: 'faq-retrieval',
  description: '检索会员权益 / 发货 / 退款的 FAQ 片段',
  vectorStore,
  indexName: 'faq',
  model: embedder,
  enableFilter: false,
});

const orderTool = createTool({
  id: 'lookup-order',
  description: '按订单号查询订单状态（模拟）',
  inputSchema: z.object({ orderId: z.string() }),
  outputSchema: z.object({ status: z.string() }),
  execute: async ({ orderId }) => {
    const orders: Record<string, string> = {
      '1001': '已发货，顺丰 SF1234567890，预计明日达',
      '1002': '已签收',
      '1003': '待付款',
    };
    return { status: orders[orderId] ?? `订单 ${orderId} 不存在` };
  },
});

const refundTool = createTool({
  id: 'submit-refund',
  description: '提交退款申请（敏感操作，必须人工审批）',
  inputSchema: z.object({
    orderId: z.string(),
    reason: z.string(),
  }),
  outputSchema: z.object({ submitted: z.boolean() }),
  requireApproval: true,
  execute: async ({ orderId, reason }) => {
    console.log(`[模拟] 退款已提交：订单 ${orderId}，原因：${reason}`);
    return { submitted: true };
  },
});

// ---------- 客服 Agent ----------
export const supportAgent = new Agent({
  id: 'support-agent',
  name: 'Support Agent',
  instructions: `
    你是智能客服。规则：
    - 会员/发货/退款政策问题：先用 faq-retrieval 检索知识库再回答
    - 查订单：用 lookup-order
    - 退款：先查订单了解情况，再用 submit-refund 提交（会触发人工审批）
    回答友好简洁，使用中文。
  `,
  model: 'deepseek/deepseek-chat',
  tools: { faqTool, orderTool, refundTool },
  memory: new Memory({ options: { lastMessages: 20 } }),
});

// ---------- Mastra 实例 ----------
