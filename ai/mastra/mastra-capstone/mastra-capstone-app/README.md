# mastra-capstone-app — 端到端智能客服：RAG 知识库 + 订单工具 + 会话记忆 + 退款审批

## 演示内容

端到端智能客服：RAG 知识库 + 订单工具 + 会话记忆 + 退款审批。

```bash
cd ai/mastra/mastra-capstone/mastra-capstone-app
npm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
npx tsx src/demo.ts    # 程序化演示
npx mastra dev         # 或启动 dev server + Studio
```

> 需要 DASHSCOPE_API_KEY（FAQ 嵌入）。退款触发 requireApproval 人工确认。
