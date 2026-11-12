import { workflow } from './graph.js';
import { Command } from '@langchain/langgraph';

/**
 * HITL 全流程（langgraph 1.x）：
 * 场景一 invoke → 类型化 interrupt 挂起 → resume 结构化审批 → 结束；
 * 场景二 同一节点两次 interrupt 顺序恢复（批准与否 → 驳回原因分类）。
 */
type Pending = { __interrupt__?: Array<Record<string, unknown>> };

function pendingOf(r: unknown): Array<Record<string, unknown>> {
  return (r as Pending).__interrupt__ ?? [];
}

async function main(): Promise<void> {
  // 场景一：批准路径——第一次 interrupt 恢复后直接走到 finalize
  const config = { configurable: { thread_id: 'refund-approved' } };
  const r1 = await workflow.invoke(
    { request: '订单 1002 需要退款，商品未拆封' },
    config,
  );
  const pending1 = pendingOf(r1);
  console.log('[挂起1]', JSON.stringify(pending1.map((i) => i.value)));
  // 1.x 新特性：interrupt 携带 response_schema（JSON Schema），客户端可据此渲染表单
  console.log('[表单 schema]', JSON.stringify(pending1[0]?.response_schema ?? '(未暴露)'));

  const r2 = await workflow.invoke(
    // 恢复值 = Zod schema 校验的对象；interrupt() 返回解析后的结果
    new Command({ resume: { approved: true, comment: '商品未拆封，符合政策' } }),
    config,
  );
  console.log('[批准后]', (r2 as { result?: string }).result);

  // 场景二：驳回路径——humanApproval 节点内两次 interrupt 按顺序恢复
  const config2 = { configurable: { thread_id: 'refund-declined' } };
  const s1 = await workflow.invoke(
    { request: '订单 1003 需要退款，已超 7 天' },
    config2,
  );
  console.log('[挂起1]', JSON.stringify(pendingOf(s1).map((i) => i.value)));

  const s2 = await workflow.invoke(
    new Command({ resume: { approved: false, comment: '缺少凭证' } }),
    config2,
  );
  console.log('[挂起2]', JSON.stringify(pendingOf(s2).map((i) => i.value)));

  const s3 = await workflow.invoke(
    new Command({ resume: { category: 'policy', note: '超过 7 天，建议走以旧换新' } }),
    config2,
  );
  console.log('[驳回后]', (s3 as { result?: string }).result);
}

main();
