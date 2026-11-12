import { Agent } from '@mastra/core/agent';
import { Mastra } from '@mastra/core';
import { MCPClient } from '@mastra/mcp';

/**
 * 客户端：连接本模块 8626 端口的 tasks-mcp-server（先 npx mastra dev 启动）。
 *
 * MCP Tasks 客户端配置（@mastra/mcp 2.0，SEP-2663）：
 * `tasks: true` 声明 io.modelcontextprotocol/tasks 扩展——
 * 之后对该 server 的工具调用自动转为「创建任务 + 轮询等待」，调用方无感；
 * tasksClient.tasks.get/update/cancel 可直接查看或干预某个任务。
 */
export const tasksClient = new MCPClient({
  id: 'tasks-mcp-client',
  servers: {
    tasksServer: {
      url: new URL('http://localhost:8626/mcp'),
      tasks: true,
    },
  },
});

export const reportAgent = new Agent({
  id: 'report-agent',
  name: 'Report Agent',
  instructions: `
    你是报表助手。需要销售报告时调用远程工具，拿到结果后简洁转述。
  `,
  model: 'deepseek/deepseek-chat',
});

export const mastra = new Mastra({
  agents: { reportAgent },
});
