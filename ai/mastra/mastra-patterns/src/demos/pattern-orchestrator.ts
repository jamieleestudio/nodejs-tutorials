import { mastra } from '../mastra/index.ts';

const workflow = mastra.getWorkflow('orchestratorWorkflow');
const run = await workflow.createRun();

const result = await run.start({
  inputData: { goal: '为公司公众号策划一篇 AI 编程助手主题的推文' },
});

if (result.status === 'success') {
  console.log('[汇总]', result.result.summary);
  for (const [id, step] of Object.entries(result.steps)) {
    if (step.status === 'success' && id.startsWith('worker')) {
      console.log(`[${id}]`, JSON.stringify(step.output));
    }
  }
} else {
  console.log('状态:', result.status, JSON.stringify(result));
}
