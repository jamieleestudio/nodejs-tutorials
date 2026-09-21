import { mastra } from './mastra/index.ts';

const workflow = mastra.getWorkflow('writingWorkflow');
const run = await workflow.createRun();

const result = await run.start({
  inputData: { input: 'Spring AI Alibaba 让 Java 开发者用图编排大模型工作流' },
});

if (result.status === 'success') {
  console.log('[结果]', result.result.result);
  // steps 里可以看到每一步的输入输出（按 step status 收窄后取 output）
  for (const [id, step] of Object.entries(result.steps)) {
    if (step.status === 'success') {
      console.log(`[step:${id}]`, JSON.stringify(step.output));
    }
  }
} else {
  console.log('状态:', result.status, result);
}
