# mastra-rag-chunking — 文档分块：MDocument.fromText/Markdown + recursive / markdown 策略

## 演示内容

文档分块：MDocument.fromText/Markdown + recursive / markdown 策略。

```bash
cd ai/mastra/mastra-rag/mastra-rag-chunking
npm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
npx tsx src/demo.ts    # 程序化演示
npx mastra dev         # 或启动 dev server + Studio
```

> 纯本地运行，无模型调用。已运行验证。注意 1.x 参数是 maxSize（不是 size）。
