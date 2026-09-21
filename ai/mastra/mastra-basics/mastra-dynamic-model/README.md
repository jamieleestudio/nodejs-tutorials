# mastra-dynamic-model — 动态模型：model 支持 ({ requestContext }) => 按上下文切换

## 演示内容

动态模型：model 支持 ({ requestContext }) => 按上下文切换。

```bash
cd ai/mastra/mastra-basics/mastra-dynamic-model
npm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
npx tsx src/demo.ts    # 程序化演示
npx mastra dev         # 或启动 dev server + Studio
```

> 演示 deepseek-chat（普通对话）与 deepseek-reasoner（推理）切换。已运行验证。
