import { createTool } from '@mastra/core/tools';
import { Mastra } from '@mastra/core';
import { MCPServer } from '@mastra/mcp';
import { z } from 'zod';

/**
 * 服务端：MCP Tasks（SEP-2663，@mastra/mcp 2.0 支持）。
 * 声明了 io.modelcontextprotocol/tasks 扩展的客户端调用 generate-report 时，
 * 服务端立即返回任务句柄而不是同步等 5 秒，客户端用 tasks/get 轮询结果。
 * 工具名 = MCPServer tools 记录的 key（这里是 'generate-report'）。
 */
const generateReportTool = createTool({
  id: 'generate-report',
  description: '生成指定周期的销售报告（耗时约 5 秒的慢任务）',
  inputSchema: z.object({
    period: z.string().describe('报告周期，如：上周'),
  }),
  outputSchema: z.object({
    report: z.string(),
  }),
  execute: async ({ period }) => {
    // 模拟长耗时计算：数据库聚合、报表渲染……
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return {
      report: `【${period}销售报告】GMV 128 万，环比 +12%；TOP 客户：杭州云启；退款率 1.8%。`,
    };
  },
});

export const tasksMcpServer = new MCPServer({
  id: 'tasks-mcp-server',
  name: 'Tasks MCP Server',
  version: '1.0.0',
  tools: { 'generate-report': generateReportTool },
  // MCP Tasks 配置（1.81 新特性）：
  // - 'always'  总是以任务应答；'auto' 超过 syncWindowMs 才转任务；'off' 关闭
  // - required  强制某些工具只能以任务方式调用（未声明扩展的客户端收到 -32021）
  // - ttlMs     任务保留时长；recover  控制进程重启后是否重跑
  tasks: {
    tools: { 'generate-report': 'always' },
    ttlMs: 60 * 60 * 1000,
  },
});

export const mastra = new Mastra({
  mcpServers: { tasksMcpServer },
  server: { port: 8626 },
});
