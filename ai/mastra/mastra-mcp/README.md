# ⑥ MCP（8605）

## 这一章解决什么

MCP 双端。

## 模块清单（src/demos/ 下的演示脚本）

| 演示 | 内容 |
|---|---|
| [src/demos/mcp-server.ts](./src/demos/mcp-server.ts) | MCP 服务端：MCPServer 暴露工具与 Agent（先启动 npx mastra dev） |
| [src/demos/mcp-client.ts](./src/demos/mcp-client.ts) | MCP 客户端：MCPClient 连 8605 的 MCP 端点 + listToolsets |

## 运行

```bash
cd ai/mastra/mastra-mcp
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
npx tsx src/demos/<demo>.ts
npx mastra dev         # 或启动本分类 dev server + Studio（端口见标题）
```