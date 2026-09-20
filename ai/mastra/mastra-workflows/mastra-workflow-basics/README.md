# mastra-workflow-basics — 工作流基础：createWorkflow + createStep 链式编排 + steps 明细

## 演示内容

工作流基础：createWorkflow + createStep 链式编排 + steps 明细。

```bash
cd ai/mastra/mastra-workflows/mastra-workflow-basics
npm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
npx tsx src/demo.ts    # 程序化演示
npx mastra dev         # 或启动 dev server + Studio
```

> LLM 步骤与纯函数步骤混合；result.steps 查看每步输入输出。已运行验证。
