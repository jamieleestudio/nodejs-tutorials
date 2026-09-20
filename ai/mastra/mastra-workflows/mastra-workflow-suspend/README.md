# mastra-workflow-suspend — 挂起恢复：step 内 suspend() → run.resume({ step, resumeData })

## 演示内容

挂起恢复：step 内 suspend() → run.resume({ step, resumeData })。

```bash
cd ai/mastra/mastra-workflows/mastra-workflow-suspend
npm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
npx tsx src/demo.ts    # 程序化演示
npx mastra dev         # 或启动 dev server + Studio
```

> suspendSchema/resumeSchema 定义挂起与恢复数据形态；需 storage 持久化。已运行验证。
