# mastra-mcp-server — MCP 服务端：MCPServer 暴露 Mastra 工具与 Agent

## 演示内容

MCP 服务端：MCPServer 暴露 Mastra 工具与 Agent。

```bash
cd ai/mastra/mastra-mcp/mastra-mcp-server
pnpm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
npx tsx src/demo.ts    # 程序化演示
npx mastra dev         # 或启动 dev server + Studio
```

> 注册到 Mastra({ mcpServers }) 后 mastra dev 自动挂载 HTTP transport。先用本模块再跑 client。
