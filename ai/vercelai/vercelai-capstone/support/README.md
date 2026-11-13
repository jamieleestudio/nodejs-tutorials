# support — vercelai capstone 模块

综合实战：智能客服"小唯"——把前面所有模块拼成一台完整机器（端口 8629）。

## 架构（一行）

`ToolLoopAgent ← searchFaq(本地 BGE RAG) + lookupOrder → Hono useChat 协议端点 → 纯 fetch SSE 页`

## 运行

```bash
cd ai/vercelai
pnpm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
pnpm --filter vercelai-capstone-support demo   # → http://localhost:8629
```

## 演示内容

1. **知识层**：FAQ 4 条 → `embedMany` 建索引（启动时一次，打印"FAQ 索引就绪：4 条"）
2. **工具层**：`searchFaq`（工具内部跑 `embed` + `cosineSimilarity` 检索 top-2——rag 模块原语）、`lookupOrder`（模拟订单表）
3. **Agent 层**：`ToolLoopAgent` + instructions 强约束："政策类先 searchFaq、订单类先 lookupOrder，只依据工具结果回答，查不到就转人工"
4. **服务层**：与 ui/chat-server 同款三步——`convertToModelMessages` → `agent.stream()` → `toUIMessageStream`

试试：`积分怎么兑换？` / `订单 1001 到哪了？` / `苹果手机怎么退货？`

## 关键认知

- `agent.stream()` 返回 **Promise<StreamTextResult>**（v7）——await 后取 **`result.stream`** 再交给 `toUIMessageStream`（它要的是 `ReadableStream<TextStreamPart>` 裸流，不是结果对象）
- 工具里做 RAG = 模型自主决定"要不要查知识库"：比把全文塞 prompt 省 token，且每次检索在 tool-call 帧里可解释
- 护栏双保险：instructions 约束（只依据工具结果、不足转人工）+ 工具返回结构化数据（模型没法自由发挥）

## 对照

- langchainjs：`langchainjs-capstone/capstone-app`（LangGraph StateGraph 版的同类综合）
