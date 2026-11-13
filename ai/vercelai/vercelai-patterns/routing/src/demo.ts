/**
 * AI SDK 7 模式：路由——先分类，再分发提示词/资源
 *
 * 小模型做分类（便宜快速），不同路由走不同 instructions/参数——
 * 成本与延迟优化的标准手法。分类用 Output.choice 约束输出空间。
 * 对照：langchainjs-patterns/pattern-routing。
 *
 * 运行：pnpm --filter vercelai-patterns-routing demo
 */
import { generateText, Output } from 'ai';
import { z } from 'zod';
import { createChatModel } from 'vercelai-shared';

// ---- 路由表：每条路由一个专属提示词（真实项目还可以换模型/温度/工具集）----
const ROUTES = {
  billing: {
    label: '账单',
    instructions: '你是账单客服。解释扣费规则、退款进度与发票问题，语气专业。',
  },
  technical: {
    label: '技术支持',
    instructions: '你是技术支持工程师。分步骤排查问题，先收集版本与环境信息。',
  },
  general: {
    label: '通用',
    instructions: '你是通用客服。友好简洁地回答，无法解决时引导提交工单。',
  },
} as const;

type RouteKey = keyof typeof ROUTES;

/** 分发到对应"处理器"——这里用不同的 temperature 模拟不同策略 */
async function handle(route: RouteKey, message: string): Promise<string> {
  const { text } = await generateText({
    model: createChatModel(),
    instructions: ROUTES[route].instructions,
    prompt: message,
    temperature: route === 'technical' ? 0.2 : 0.7,
  });
  return text;
}

async function main(): Promise<void> {
  const messages = [
    '我上个月被多扣了 30 块钱，怎么退？',
    '你们的 App 打开就闪退，安卓 14，重启也没用。',
    '你们公司是哪年成立的？',
  ];

  for (const message of messages) {
    // ---- 第一步：分类（Output.choice 把输出约束在三个路由键内）----
    const { output: route } = await generateText({
      model: createChatModel(),
      output: Output.choice({ options: Object.keys(ROUTES) }),
      prompt: `把这条客服留言归类：${message}`,
    });
    console.log(`「${message}」→ 路由: ${route}（${ROUTES[route as RouteKey].label}）`);

    // ---- 第二步：按路由分发 ----
    const reply = await handle(route as RouteKey, message);
    console.log(`    回复: ${reply.trim()}\n`);
  }
}

main().catch((error) => {
  console.error('demo 失败:', error);
  process.exitCode = 1;
});
