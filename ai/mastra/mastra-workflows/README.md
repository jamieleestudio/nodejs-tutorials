# ⑤ 工作流 ★（8604）

## 这一章解决什么

Mastra 招牌：声明式编排。

## 模块清单（src/demos/ 下的演示脚本）

| 演示 | 内容 |
|---|---|
| [src/demos/workflow-basics.ts](./src/demos/workflow-basics.ts) | 步骤链式编排：createWorkflow + createStep + steps 明细 |
| [src/demos/workflow-branching.ts](./src/demos/workflow-branching.ts) | 分支路由：.branch([[谓词, 步骤]]) |
| [src/demos/workflow-suspend.ts](./src/demos/workflow-suspend.ts) | 挂起恢复：suspend() → run.resume({ step, resumeData }) |
| [src/demos/workflow-parallel.ts](./src/demos/workflow-parallel.ts) | 并行执行：.parallel([...]) + 隐式 barrier 汇合 |
| [src/demos/workflow-error.ts](./src/demos/workflow-error.ts) | 错误处理：易错步骤降级 → branch 走 fallback |

## 运行

```bash
cd ai/mastra/mastra-workflows
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
npx tsx src/demos/<demo>.ts
npx mastra dev         # 或启动本分类 dev server + Studio（端口见标题）
```