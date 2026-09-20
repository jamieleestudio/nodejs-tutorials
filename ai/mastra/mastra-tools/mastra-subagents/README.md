# mastra-subagents — 子 Agent：构造器 agents 选项（Agent-as-Tool 委派）

## 演示内容

子 Agent：构造器 agents 选项（Agent-as-Tool 委派）。

```bash
cd ai/mastra/mastra-tools/mastra-subagents
npm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
npx tsx src/demo.ts    # 程序化演示
npx mastra dev         # 或启动 dev server + Studio
```

> 主管按 description 委派专家；委派时子 Agent 记忆自动隔离。已运行验证。
