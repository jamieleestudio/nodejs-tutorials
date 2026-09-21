import { Agent } from '@mastra/core/agent';
import { createTool } from '@mastra/core/tools';
import { Mastra } from '@mastra/core';
import { LibSQLStore } from '@mastra/libsql';
import { z } from 'zod';

// 敏感工具：requireApproval 在执行前挂起，等人工审批
const sendEmailTool = createTool({
  id: 'send-email',
  description: '发送通知邮件（敏感操作，需要审批）',
  inputSchema: z.object({
    to: z.string().describe('收件人邮箱'),
    subject: z.string().describe('邮件主题'),
  }),
  outputSchema: z.object({
    sent: z.boolean(),
  }),
  requireApproval: true,
  execute: async ({ to, subject }) => {
    // 模拟发送：审批通过后才会执行到这里
    return { sent: true };
  },
});

const lookupOrderTool = createTool({
  id: 'lookup-order',
  description: '按订单号查询订单状态（模拟数据，无需审批）',
  inputSchema: z.object({
    orderId: z.string().describe('订单号，如 1001'),
  }),
  outputSchema: z.object({
    status: z.string(),
  }),
  execute: async ({ orderId }) => {
    const orders: Record<string, string> = {
      '1001': '已发货，预计明日达',
      '1002': '已签收',
      '1003': '待付款',
    };
    return { status: orders[orderId] ?? `订单 ${orderId} 不存在` };
  },
});

export const approvalAgent = new Agent({
  id: 'approval-agent',
  name: 'Approval Agent',
  instructions: `
    你是客服助手。查订单用 lookup-order 工具；发邮件用 send-email 工具。
    回答简洁友好。
  `,
  model: 'deepseek/deepseek-chat',
  tools: { sendEmailTool, lookupOrderTool },
});

// requireApproval 依赖 snapshot：必须配置持久化 storage
