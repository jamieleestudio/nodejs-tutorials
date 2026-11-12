# mcp-elicitation — LangChain.js mcp 模块

## 演示

```bash
cd ai/langchainjs
pnpm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
pnpm --filter langchainjs-mcp-elicitation demo
```

## 演示内容

MCP **elicitation**（mcp-adapters 2.0 新能力）：服务端工具执行到一半需要用户补充输入时，
向客户端发起 `elicitation/create` 请求；客户端决定怎么收集并回答。

- `src/server.mjs`：自定义 stdio MCP server（@modelcontextprotocol/sdk 1.32），
  `book_meeting_room` 工具执行前调用 `server.elicitInput()` 向客户端要「参会人数 + 楼层」。
- `src/demo.ts`：`MCPAdapter`（2.0 新 API）连接该 server，连接配置
  `mode: 'legacy'` + `onElicitation` 处理器收到问题后代答 `{ action: 'accept', content }`；
  Agent 全流程：用户提问 → 模型调工具 → 服务端 elicit → 客户端作答 → 工具继续执行 → 返回结果。

## 对应新特性

- `MCPAdapter` 取代 `MultiServerMCPClient`（2.0 更名，`servers` 直配、`listTools()`/`listToolsets()`）
- 连接级 `mode: 'legacy'` + `onElicitation: (request, context) => ElicitResult` 编程作答
- 进阶：`elicitation: true` + 新版 server 的 `input_required` 工具结果 → 问题自动转
  LangGraph `interrupt`（需 checkpointer），用 `createMCPElicitationResume()` 构造恢复值
