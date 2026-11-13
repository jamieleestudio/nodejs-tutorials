# agent-class — vercelai agents 模块

`ToolLoopAgent`：把"模型 + 工具 + 停止条件 + 指令"封装成可复用对象。

## 运行

```bash
cd ai/vercelai
pnpm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
pnpm --filter vercelai-agents-agent-class demo
```

## 演示内容

1. **组装**：`new ToolLoopAgent({ id, instructions, model, tools, stopWhen })`——一次配置，多处调用
2. **generate / stream**：同一个 agent 两种消费方式（注意 `.stream()` 返回 Promise，await 后拿流句柄）
3. **类型推断**：从实例反推工具表类型

```ts
const agentTools = assistant.tools;          // ToolLoopAgent 的 tools getter
type AssistantTools = typeof agentTools;     // { calculator: …, daysElapsed: … }
```

> v7 变化：Agent 类定名 **ToolLoopAgent**（旧别名 `Experimental_Agent` 仍在）；
> `InferAgentTools` 类型在类型文件里有定义但**未导出**，用上面的 getter 推导替代。

## 对照

- langchainjs：`langchainjs-agents/agent-basics`
- mastra：Agent 类（createAgent）——AI SDK 7 的 ToolLoopAgent 与之同构（model/tools/instructions + generate/stream）
