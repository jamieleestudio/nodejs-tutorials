# parallel-loop — vercelai patterns 模块

并行与循环：`Promise.all` 并行多任务 + 生成-评审收敛循环。

## 运行

```bash
cd ai/vercelai
pnpm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
pnpm --filter vercelai-patterns-parallel-loop demo
```

## 演示内容

1. **并行**：三个互不依赖的子任务 `Promise.all` 同时发出——总耗时 ≈ 最慢一个，而非求和
2. **循环**：草稿 → `Output.object` 结构化评审（score + feedback）→ 未达标带意见重写，收敛到 7 分或 3 轮上限

## 关键认知

- **AI SDK 没有图引擎**（对比 langgraph / mastra workflows）——并行 = `Promise.all`，循环 = for/while + 停止条件，编排就是普通 TS 控制流
- 结构化评审让停止条件变成可靠的数据判断（`score >= 7`），而非解析自由文本
- 同样的组合还能长出 map-reduce、fan-out/fan-in

## 对照

- langchainjs：`langchainjs-patterns/pattern-parallel`（并行分发）+ `langchainjs-workflows/cycle`（图引擎的循环节点）
