import { mastra } from '../mastra/index.ts';

const workflow = mastra.getWorkflow('approvalWorkflow');

// 1. 启动 → 执行到 approval 步骤挂起
const run = await workflow.createRun();
const result = await run.start({
  inputData: { input: '策划一次 30 分钟的 Mastra Workflow 技术分享' },
});

if (result.status !== 'suspended') {
  console.log('未挂起？状态:', result.status);
  process.exit(0);
}
console.log('[挂起]', JSON.stringify(result.suspendPayload));

// 2. 人工审批后恢复（生产中 resumeData 来自审批系统回调）
const resume = await run.resume({
  step: 'approval',
  resumeData: { approved: true, feedback: '第二条改成现场演示，控制在 5 分钟内' },
});

if (resume.status === 'success') {
  console.log('[落地结果]', resume.result.result);
} else {
  console.log('恢复后状态:', resume.status, JSON.stringify(resume));
}
