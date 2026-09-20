import { mastra } from './mastra/index.ts';

const workflow = mastra.getWorkflow('parallelWorkflow');
const run = await workflow.createRun();

const result = await run.start({
  inputData: { input: '给公司内部知识库加一个 AI 问答机器人' },
});

if (result.status === 'success') {
  console.log('[结论]', result.result.verdict);
  for (const [id, step] of Object.entries(result.steps)) {
    if (step.status === 'success') {
      console.log(`[step:${id}]`, JSON.stringify(step.output));
    }
  }
} else {
  console.log('状态:', result.status, JSON.stringify(result));
}
