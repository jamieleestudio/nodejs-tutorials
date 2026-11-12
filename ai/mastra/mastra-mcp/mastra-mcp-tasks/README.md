# mastra-mcp-tasks — MCP Tasks 长时任务（SEP-2663）

## 演示

```bash
cd ai/mastra
pnpm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY

# 终端 1：启动服务端（端口 8626）
pnpm --filter nodejs-tutorials-ai-mastra-mcp-tasks dev

# 终端 2：运行客户端演示
pnpm --filter nodejs-tutorials-ai-mastra-mcp-tasks demo
```

## 演示内容

MCP Tasks（`io.modelcontextprotocol/tasks` 扩展，@mastra/mcp 2.0 / Mastra 1.81+）：
把慢工具调用变成**任务**——服务端立即返回任务句柄，客户端轮询拿结果，
工具调用保持原有形状但可以跑几分钟甚至几小时。

| 角色 | 文件 | 说明 |
|---|---|---|
| 服务端 | `src/mastra/index.ts` | 5 秒慢工具 `generate-report`，`tasks: { tools: { 'generate-report': 'always' } }` 声明「总是以任务应答」 |
| 客户端 | `src/client.ts` | `MCPClient` 连接配置 `tasks: true` 声明扩展；工具调用自动转任务并等待 |
| 演示 | `src/demo.ts` | agent.stream 观察输出流里的 `mcp-task` 进度事件，最后 `tasksClient.tasks.get()` 复核任务终态 |

## 对应新特性

- `MCPServer` 的 `tasks` 配置：`default`/`tools`/`workflows`/`agents` 按粒度开启，
  `required` 强制某些工具只能以任务方式调用，`ttlMs`/`recover` 控制任务生命周期与恢复
- `MCPClient` 连接级 `tasks: true`；`client.tasks.get/update/cancel(serverName, taskId)`
- 任务的输入请求（`input_required`）可经 `inputRequests` 处理器自动作答
