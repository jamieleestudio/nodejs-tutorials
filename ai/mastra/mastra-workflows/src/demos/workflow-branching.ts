import { mastra } from '../mastra/index.ts';

const workflow = mastra.getWorkflow('routingWorkflow');
const run = await workflow.createRun();

const result = await run.start({
  inputData: { input: '我上个月被重复扣了一次会员费，请处理一下' },
});

if (result.status === 'success') {
  // branch 的输出按 step id 分组；找到命中的专家分支
  for (const [id, step] of Object.entries(result.steps)) {
    if (id.startsWith('expert') && step.status === 'success') {
      const out = step.output as { lane: string; answer: string };
      console.log(`[lane] ${out.lane}`);
      console.log(`[answer] ${out.answer}`);
    }
  }
} else {
  console.log('状态:', result.status, JSON.stringify(result));
}
