import { mastra } from './mastra/index.ts';

const workflow = mastra.getWorkflow('resilientWorkflow');
const run = await workflow.createRun();

const result = await run.start({ inputData: { query: '当前系统负载情况' } });

if (result.status === 'success') {
  console.log('[输出]', result.result.output);
  console.log('[走了哪条路径]', Object.keys(result.steps).join(' → '));
} else {
  console.log('状态:', result.status, JSON.stringify(result));
}
