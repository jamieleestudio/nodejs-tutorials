# mastra-mcp-client — MCP 客户端：MCPClient 连 8618 的 saa-mcp-server

## 演示内容

MCP 客户端：MCPClient 连 8618 的 saa-mcp-server。

```bash
cd ai/mastra/mastra-mcp/mastra-mcp-client
npm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
npx tsx src/demo.ts    # 程序化演示
npx mastra dev         # 或启动 dev server + Studio
```

> listTools() 发现工具、listToolsets() 注入 agent。需先启动 mastra-mcp-server。
