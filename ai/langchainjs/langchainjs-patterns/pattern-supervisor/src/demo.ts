import { ChatOpenAI } from '@langchain/openai';
import { createChatModel } from 'langchainjs-shared';

/**
 * 主管模式（纯 LLM 编排，无 langgraph）：主管 Agent 输出 JSON 决策
 * { next: 'plan'|'write'|'review'|'done', feedback }，代码按决策调度工人，循环到 done。
 * 对照 Java 侧 agentic-supervisor / pattern-supervisor、agentscope-supervisor。
 */
const maxRounds = 4;

const model = createChatModel();

async function ask(prompt: string): Promise<string> {
  const r = await model.invoke(prompt);
  return String(r.content);
}

async function main(): Promise<void> {
  const goal = '写一段产品发布会的开场白，主题是 AI 赋能企业客服';
  const log: string[] = [];
  let work = '';
  let done = false;

  for (let round = 1; round <= maxRounds && !done; round++) {
    const decision = await ask(
      `你是任务主管。目标：${goal}\n当前进展：${work || '（无）'}\n` +
        '决定下一步，只输出 JSON：{"next":"plan"|"write"|"review"|"done","feedback":"..."}',
    );
    let parsed: { next: string; feedback?: string };
    try {
      parsed = JSON.parse(decision.slice(decision.indexOf('{'), decision.lastIndexOf('}') + 1));
    } catch {
      parsed = { next: 'done', feedback: '' };
    }
    log.push(`round ${round}: 主管决定 ${parsed.next}`);
    if (parsed.next === 'plan') {
      work = await ask(`把目标拆成 2-3 个执行要点：${goal}。参考反馈：${parsed.feedback}`);
      log.push(`  工人产出: ${work.slice(0, 60)}...`);
    } else if (parsed.next === 'write') {
      work = await ask(`根据要点写开场白（60 字内）：${goal}\n要点：${work}`);
      log.push(`  工人产出: ${work.slice(0, 60)}...`);
    } else if (parsed.next === 'review') {
      const v = await ask(`审查并直接输出终稿：${work}`);
      work = v;
      log.push(`  工人产出: ${v.slice(0, 60)}...`);
    } else {
      done = true;
    }
  }
  console.log(log.join('\n'));
  console.log('\n[终稿]', work);
}

main();
