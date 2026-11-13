# routing — vercelai patterns 模块

路由模式：先分类，再分发提示词/参数/资源——成本与延迟优化的标准手法。

## 运行

```bash
cd ai/vercelai
pnpm install
cp .env.example .env   # 填入 DEEPSEEK_API_KEY
pnpm --filter vercelai-patterns-routing demo
```

## 演示内容

1. **分类**：`Output.choice({ options: Object.keys(ROUTES) })` 把输出约束在路由键内——不会出现自由文本分类的解析地狱
2. **分发**：路由表每条路由有专属 `instructions` 与 temperature（技术支持 0.2 求稳、其余 0.7 求活）
3. 三条真实留言走完整流程：账单 / 技术支持 / 通用各自命中

## 关键认知

- 路由 = 分类 + 查表分发，AI SDK 里一个 `Output.choice` + 普通对象就够
- 真实项目还能按路由换模型（分类用便宜模型、复杂任务换推理模型）或换工具集

## 对照

- langchainjs：`langchainjs-patterns/pattern-routing`
