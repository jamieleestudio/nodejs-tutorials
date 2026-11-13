# stdio — vercelai mcp 模块

MCP stdio 传输：`createMCPClient` + `StdioMCPTransport` → 工具直接注入 agent。

## 运行

```bash
cd ai/vercelai
pnpm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
pnpm --filter vercelai-mcp-stdio demo   # 首次运行 npx 自动下载 server-everything
```

## 演示内容

1. **连接**：`new StdioMCPTransport({ command: 'npx', args: ['-y', '@modelcontextprotocol/server-everything'] })` 启动子进程 server 并握手；`client.serverInfo` 看对端信息
2. **工具发现**：`client.tools()` 把 MCP 工具表转成 `generateText` 可直接用的 `ToolSet`（16 个工具）
3. **agent 循环**：模型自主调用 `add`/`echo` 跨进程执行并汇总回答

## 关键认知

- v7 变化：MCP 客户端从主包拆到独立包 **`@ai-sdk/mcp`**（stdio 传输在 `@ai-sdk/mcp/mcp-stdio` 子路径；旧的 `experimental_createMCPClient` 不再存在）
- stdio 传输用 cross-spawn 起 Windows 下的 `.cmd` 也没问题
- `finally` 里 `client.close()` 关子进程，别留僵尸进程

## 对照

- langchainjs：`langchainjs-mcp/mcp-stdio`（MCPAdapter.listTools，同一个 server-everything）
