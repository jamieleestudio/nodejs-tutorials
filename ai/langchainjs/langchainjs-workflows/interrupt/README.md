# interrupt — LangChain.js workflows 模块

## 演示

```bash
cd ai/langchainjs
pnpm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
pnpm --filter langchainjs-interrupt demo
```

## 演示内容

HITL（人工介入）全流程：invoke → interrupt 挂起 → Command.resume 恢复。

langgraph 1.x 增强（本组升级后演示）：

- `interrupt(value, { responseSchema })`：恢复值用 Zod schema 校验并解析
  （`interrupt()` 返回解析后的对象），同时以 JSON Schema 暴露给客户端渲染表单
- 同一节点内多次 `interrupt()` 顺序挂起/恢复：demo 双场景——
  批准路径一次恢复直达 finalize；驳回路径恢复后追问「驳回原因分类」第二次挂起

