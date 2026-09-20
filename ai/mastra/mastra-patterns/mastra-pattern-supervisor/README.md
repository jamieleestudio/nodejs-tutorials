# mastra-pattern-supervisor — 主管模式：supervisor + agents 选项委派 subagents

## 演示内容

主管模式：supervisor + agents 选项委派 subagents。

```bash
cd ai/mastra/mastra-patterns/mastra-pattern-supervisor
npm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
npx tsx src/demo.ts    # 程序化演示
npx mastra dev         # 或启动 dev server + Studio
```

> 与其他组 supervisor 1:1 对照；审批请求沿委派链向上传播。
