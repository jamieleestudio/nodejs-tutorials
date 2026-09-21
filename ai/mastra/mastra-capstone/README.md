# ⑨ 综合（8608）

## 这一章解决什么

端到端综合。
> 需要额外环境变量：DASHSCOPE_API_KEY（嵌入，见 .env.example）。

## 模块清单（src/demos/ 下的演示脚本）

| 演示 | 内容 |
|---|---|
| [src/demos/c.ts](./src/demos/c.ts) | a |
| [src/demos/端.ts](./src/demos/端.ts) | 到 |

## 运行

```bash
cd ai/mastra/mastra-capstone
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
npx tsx src/demos/<demo>.ts
npx mastra dev         # 或启动本分类 dev server + Studio（端口见标题）
```