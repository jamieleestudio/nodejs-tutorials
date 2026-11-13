# transform — vercelai streaming 模块

流式变换：`smoothStream` 平滑输出 + `partialOutputStream` 部分 JSON 流。

## 运行

```bash
cd ai/vercelai
pnpm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
pnpm --filter vercelai-streaming-transform demo
```

## 演示内容

1. **smoothStream**：`experimental_transform: smoothStream({ chunking: 'word', delayInMs })` 把一顿一顿的原始 token 流抹成匀速按词输出——纯展示层，不影响生成
2. **streamText + Output.object + partialOutputStream**：每个事件都是"到目前为止校验过的半成品对象"（`DeepPartial<Poi>`），流式渲染表单/卡片的标准姿势

> v7 变化：`streamObject` 已 deprecated（`generateObject` 同），新姿势 = `streamText` + `output: Output.object(...)`；
> 部分对象流从 `partialObjectStream` 改名 **`partialOutputStream`**。

## 对照

- langchainjs：`langchainjs-basics/streaming`（transform 回调逐 token 改写）
