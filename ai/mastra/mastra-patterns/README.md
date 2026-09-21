# ⑧ 编排模式 ★（8607）

## 这一章解决什么

与其他组 patterns 1:1 对照。

## 模块清单（src/demos/ 下的演示脚本）

| 演示 | 内容 |
|---|---|
| [src/demos/pattern-routing.ts](./src/demos/pattern-routing.ts) | 路由模式：结构化分类 → branch 分发三路专家 |
| [src/demos/pattern-parallel.ts](./src/demos/pattern-parallel.ts) | 并行模式：三位评审 parallel 并发 → merge 汇总 |
| [src/demos/pattern-orchestrator.ts](./src/demos/pattern-orchestrator.ts) | 编排者-工人：结构化拆解 → parallel 并行 → 汇总 |
| [src/demos/pattern-supervisor.ts](./src/demos/pattern-supervisor.ts) | 主管模式：supervisor + agents 选项委派 subagents |

## 运行

```bash
cd ai/mastra/mastra-patterns
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
npx tsx src/demos/<demo>.ts
npx mastra dev         # 或启动本分类 dev server + Studio（端口见标题）
```