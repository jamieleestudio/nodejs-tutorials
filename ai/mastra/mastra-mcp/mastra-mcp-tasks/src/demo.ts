import { tasksClient, reportAgent } from './client.ts';

/**
 * MCP Tasks（SEP-2663）端到端演示：
 * 前提——先在另一个终端启动服务端：
 *   pnpm --filter nodejs-tutorials-ai-mastra-mcp-tasks dev   （端口 8626）
 *
 * generate-report 是 5 秒慢工具，服务端配置为 'always' 以任务方式应答；
 * 客户端声明 tasks 扩展后，工具调用自动变成「任务创建 + 轮询」，
 * 并在输出流里产生 mcp-task 进度事件；tasksClient.tasks.get 可查任务终态。
 */
async function main(): Promise<void> {
  const start = Date.now();

  const stream = await reportAgent.stream('帮我生成上周的销售报告', {
    toolsets: await tasksClient.listToolsets(),
  });

  // task-backed 工具的输出流里会出现 mcp-task 进度（任务创建/状态变化）
  let taskId: string | null = null;
  for await (const chunk of stream.fullStream) {
    const progress = chunk as { type?: string; taskId?: string; status?: string };
    if (progress.type === 'mcp-task' && progress.taskId) {
      taskId ??= progress.taskId;
      console.log(`[MCP 任务 ${progress.taskId}] ${progress.status}`);
    }
  }

  console.log(`[回答] ${await stream.text}`);
  console.log(`[耗时] ${Math.round((Date.now() - start) / 1000)}s（其中工具以 MCP Task 方式执行约 5s）`);

  // 用 tasks/get 复核任务终态（status: completed / failed / cancelled / working / input_required）
  if (taskId) {
    const task = await tasksClient.tasks.get('tasksServer', taskId);
    console.log(`[tasks/get] status=${task.status}`);
  } else {
    console.log('[tasks/get] 未捕获到任务事件（服务端可能以同步方式应答了）');
  }

  await tasksClient.disconnect();
}

main();
