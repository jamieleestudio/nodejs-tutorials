# ⑦ 评估（8606）

## 这一章解决什么

Scorer 体系。

## 模块清单（src/demos/ 下的演示脚本）

| 演示 | 内容 |
|---|---|
| [src/demos/e.ts](./src/demos/e.ts) | v |
| [src/demos/评.ts](./src/demos/评.ts) | 估 |

## 运行

```bash
cd ai/mastra/mastra-evals
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
npx tsx src/demos/<demo>.ts
npx mastra dev         # 或启动本分类 dev server + Studio（端口见标题）
```