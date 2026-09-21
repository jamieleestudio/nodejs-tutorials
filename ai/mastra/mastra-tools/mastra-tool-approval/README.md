# mastra-tool-approval — 工具审批 HITL：requireApproval 挂起 + approveToolCallGenerate 恢复

## 演示内容

工具审批 HITL：requireApproval 挂起 + approveToolCallGenerate 恢复。

```bash
cd ai/mastra/mastra-tools/mastra-tool-approval
npm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
npx tsx src/demo.ts    # 程序化演示
npx mastra dev         # 或启动 dev server + Studio
```

> 需要 storage（snapshot）。generate 返回 finishReason: suspended。已运行验证。
