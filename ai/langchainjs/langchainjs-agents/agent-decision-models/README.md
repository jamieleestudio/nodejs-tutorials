# agent-decision-models — LangChain.js agents 模块

## 演示

```bash
cd ai/langchainjs
pnpm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
pnpm --filter langchainjs-agent-decision-models demo
```

## 演示内容

LangChain.js 1.6 引入的**决策模型（Decisions）**体系：决策模型不写答案，
只回答类型化问题（`noul` 是/否概率、`choice` 选标签、`score` 量表、`box` 定位），
答案自带概率分布与置信度，适合做路由、风控、分级判断。

| 分部 | 内容 |
|---|---|
| 1. 直接调用 | 用 DeepSeek 实现 `BaseDecisionModel` 子类（官方自带 `OpenAIDecisions` 走 OpenAI Decisions API，DeepSeek 需自实现 `_classify`），直接 `invoke` noul + choice 问题 |
| 2. 模型路由 | `modelRouterMiddleware`（1.6.5）：决策模型在运行前选 `fast`/`powerful` 模型，完整 `ChoiceAnswer` 存入 `state.modelRoute` |
| 3. 工具守门 | `autoModeMiddleware`（1.6.5）：工具执行前评估风险，概率 ≥ 0.5 的危险调用（删除生产文件）被拦截，只读调用放行 |
| 4. 拒绝即失败 | `modelRefusalMiddleware`（1.6.4）：检测供应商以成功响应返回的 refusal block 并抛错，生产环境与 `modelFallbackMiddleware` 组合 |

## 对应新特性

- `@langchain/core/decisions`：`BaseDecisionModel` / `ClassifierRequest` / `ClassifierResponse`
- `langchain` 1.6.x：`modelRouterMiddleware`、`autoModeMiddleware`、`modelRefusalMiddleware`
- 官方另有 `openAIModelRouterMiddleware` / `openAIAutoModeMiddleware`（基于 OpenAI Decisions API 的开箱版）
