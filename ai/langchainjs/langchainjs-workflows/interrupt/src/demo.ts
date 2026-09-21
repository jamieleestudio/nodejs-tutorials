import { workflow } from './graph.js';
import { Command } from '@langchain/langgraph';

/**
 * HITL 全流程：invoke → interrupt 挂起 → Command.resume 恢复。
 */
async function main(): Promise<void> {
  const config = { configurable: { thread_id: 'refund-demo' } };

  // 1. 首次执行：在 approval 节点挂起
  const r1 = await workflow.invoke(
    { request: '订单 1002 需要退款，商品未拆封' },
    config,
  );
  // r1.__interrupt__ 携带挂起信息（若有）
  const interrupted = (r1 as { __interrupt__?: unknown[] }).__interrupt__;
  console.log('[挂起]', JSON.stringify(interrupted ?? '未挂起'));

  // 2. 人工批准后恢复执行
  const r2 = await workflow.invoke(
    new Command({ resume: 'yes' }),
    config,
  );
  console.log('[批准后]', JSON.stringify(r2, null, 2).slice(0, 300));
}

main();
