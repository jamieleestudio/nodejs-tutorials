# ② 工具（8601）

## 这一章解决什么

工具与委派。

## 模块清单（src/demos/ 下的演示脚本）

| 演示 | 内容 |
|---|---|
| [src/demos/tools-basics.ts](./src/demos/tools-basics.ts) | 工具调用：createTool + Zod schema（weatherTool + calculatorTool） |
| [src/demos/subagents.ts](./src/demos/subagents.ts) | 子 Agent 委派：构造器 agents 选项（Agent-as-Tool） |
| [src/demos/tool-approval.ts](./src/demos/tool-approval.ts) | 工具审批 HITL：requireApproval 挂起 + approveToolCallGenerate 恢复 |

## 运行

```bash
cd ai/mastra/mastra-tools
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
npx tsx src/demos/<demo>.ts
npx mastra dev         # 或启动本分类 dev server + Studio（端口见标题）
```