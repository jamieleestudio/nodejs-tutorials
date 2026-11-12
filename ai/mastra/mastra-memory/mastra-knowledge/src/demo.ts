import { mastra, productKnowledge } from './mastra/index.ts';

/**
 * Knowledge v2（1.82 新特性）演示：
 * 1. 宿主应用用 upsertPage 按文件树幂等写入页面（docs 站 / CMS 同步场景）；
 * 2. Agent 挂载 Knowledge 后按 scope 检索回答（knowledge_search → knowledge_read）。
 */
async function main(): Promise<void> {
  // 1. 宿主写入：scope 首次写入时自动创建；重复运行内容未变则 status=unchanged
  const refund = await productKnowledge.upsertPage({
    scope: 'org:acme',
    path: 'policies/refund',
    name: '退款政策',
    body: '标准退款：购买后 7 天内可全额退款；年度套餐 30 天内可退 80%；'
      + '企业版退款需联系客户成功经理。处理时限 3 个工作日。',
  });
  console.log(`[写入页面] org:acme#policies/refund → ${refund.status}`);

  await productKnowledge.upsertPage({
    scope: 'org:acme',
    path: 'policies/sla',
    name: 'SLA 说明',
    body: '专业版可用性 SLA 99.5%，企业版 99.95%。故障赔偿按月度费用比例返还。',
  });
  console.log('[写入页面] org:acme#policies/sla → 完成');

  // 2. Agent 检索：docs-agent 已静态携带 org:acme scope，自动用知识工具作答
  const agent = mastra.getAgentById('docs-agent');
  const r = await agent.generate('你们的退款政策是什么？年度套餐超过 7 天还能退吗？');
  console.log('[回答1]', r.text);

  const r2 = await agent.generate('SLA 保障是多少？故障了怎么赔？');
  console.log('[回答2]', r2.text);
}

main();
