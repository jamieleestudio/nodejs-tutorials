# http — vercelai mcp 模块

MCP Streamable HTTP 传输：跨组联动——直连 mastra 组 8618 的 MCP server。

## 前置：启动 mastra 组 MCP server

```bash
cd ai/mastra
pnpm --filter nodejs-tutorials-ai-mastra-mcp-server dev   # http://localhost:8618/mcp
```

## 运行

```bash
cd ai/vercelai
pnpm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
pnpm --filter vercelai-mcp-http demo
```

## 演示内容

1. **HTTP 传输**：`transport: { type: 'http', url: 'http://localhost:8618/mcp' }`——直接给配置对象，无需实例化传输类
2. **原始 RPC 视角**：`listTools()` 看工具表、`callTool({ name, arguments })` 程序直调（不经过模型）——get-weather / lookup-order
3. **agent 视角**：`tools()` 注入 `generateText`，模型自主决定调哪个工具回答"杭州天气 + 订单 1001"

## 关键认知

- MCP 的意义在这一刻具象化：mastra 组（另一套框架）的服务端，本组客户端零适配直接消费——协议即边界
- 两种消费姿势：程序直调（`callTool`）与模型编排（`tools()` 注入），按需选择
- server 支持 resources/prompts 时还可用 `listResources` / `readResource` / `listPrompts` / `getPrompt`；需要服务端向用户要参数时用 `onElicitationRequest`

## 对照

- langchainjs：`langchainjs-mcp/mcp-agent`（同样的跨组消费方式）
