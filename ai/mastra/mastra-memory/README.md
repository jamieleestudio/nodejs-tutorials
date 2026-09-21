# ③ 记忆（8602）

## 这一章解决什么

三层记忆。
> 需要额外环境变量：DASHSCOPE_API_KEY（嵌入，见 .env.example）。

## 模块清单（src/demos/ 下的演示脚本）

| 演示 | 内容 |
|---|---|
| [src/demos/memory-working.ts](./src/demos/memory-working.ts) | 工作记忆：resource 级用户档案，跨 thread 生效 |
| [src/demos/memory-recall.ts](./src/demos/memory-recall.ts) | 语义召回：semanticRecall + 嵌入（DashScope 兼容端点） |
| [src/demos/memory-persistence.ts](./src/demos/memory-persistence.ts) | 记忆持久化：LibSQLStore file 落盘（write/read 两进程演示） |

## 运行

```bash
cd ai/mastra/mastra-memory
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
npx tsx src/demos/<demo>.ts
npx mastra dev         # 或启动本分类 dev server + Studio（端口见标题）
```