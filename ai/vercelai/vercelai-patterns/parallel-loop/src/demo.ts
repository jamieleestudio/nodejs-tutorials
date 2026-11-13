/**
 * AI SDK 7 模式：并行与循环——Promise.all 并行多任务 + 生成-评审收敛循环
 *
 * AI SDK 没有图引擎（对比 langgraph / mastra workflows）——
 * 用纯 TS 控制流组合原语就够：并行 = Promise.all，循环 = while + 停止条件。
 * 对照：langchainjs-patterns/pattern-parallel 与 langchainjs-workflows/cycle。
 *
 * 运行：pnpm --filter vercelai-patterns-parallel-loop demo
 */
import { generateText, Output } from 'ai';
import { z } from 'zod';
import { createChatModel } from 'vercelai-shared';

const ReviewSchema = z.object({
  score: z.number().min(0).max(10).describe('质量分'),
  feedback: z.string().describe('一句话修改意见'),
});

async function main(): Promise<void> {
  const model = createChatModel();

  // ---- 1. 并行：三个独立子任务同时发出（互不依赖）----
  const t0 = Date.now();
  const summaries = await Promise.all(
    [
      '用一句话解释 async/await 解决了什么问题。',
      '用一句话解释 Node.js 事件循环的适用场景。',
      '用一句话解释 TypeScript 对大型项目的价值。',
    ].map((prompt) => generateText({ model, prompt })),
  );
  console.log(`【1】3 个任务并行完成（${Date.now() - t0}ms，串行约需 3 倍时间）:`);
  summaries.forEach((r, i) => console.log(`    ${i + 1}. ${r.text.trim()}`));

  // ---- 2. 循环：草稿 → 评审 → 按意见改，直到达标或到达上限 ----
  const draftPrompt = '写一段 60 字以内的并行计算科普，面向初中生。';
  const start = Date.now();
  let draft = (await generateText({ model, prompt: draftPrompt })).text;

  for (let round = 1; round <= 3; round++) {
    const { output: review } = await generateText({
      model,
      output: Output.object({ schema: ReviewSchema }),
      prompt: `评审这段科普（10 分制，7 分以上通过）：\n${draft}`,
    });
    console.log(`【2】第 ${round} 轮评审：${review.score}/10 — ${review.feedback}`);

    if (review.score >= 7) {
      console.log(`    ✓ 通过（共 ${(Date.now() - start) / 1000}s）`);
      break;
    }
    // 未达标：带评审意见重写（循环直到收敛或到达步数上限）
    draft = (
      await generateText({
        model,
        prompt: `${draftPrompt}\n\n当前草稿：${draft}\n评审意见：${review.feedback}\n请按意见重写。`,
      })
    ).text;
  }
  console.log(`    最终稿: ${draft.trim()}`);

  // 备注：并行 + 循环还能组合出 map-reduce、fan-out/fan-in 等形态——
  // AI SDK 的哲学是把编排留给 TS 本身（对比 mastra workflows 的图引擎）。
}

main().catch((error) => {
  console.error('demo 失败:', error);
  process.exitCode = 1;
});
