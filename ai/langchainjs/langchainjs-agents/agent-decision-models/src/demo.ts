import {
  createAgent,
  tool,
  modelRouterMiddleware,
  autoModeMiddleware,
  modelRefusalMiddleware,
} from 'langchain';
import { BaseDecisionModel, parseClassifierResponse } from '@langchain/core/decisions';
import type { ClassifierResponse, Question, State } from '@langchain/core/decisions';
import { z } from 'zod';
import { createChatModel } from 'langchainjs-shared';

/**
 * 决策模型（Decisions，langchain 1.6 新特性）：
 * 决策模型不写答案，只回答“类型化问题”——noul（是/否概率）、choice（选标签）、
 * score（量表）、box（定位）。官方自带 OpenAIDecisions（走 OpenAI Decisions API），
 * 这里用 DeepSeek 实现 BaseDecisionModel 子类：把问题翻译成一次 JSON 输出的聊天调用。
 */
class DeepSeekDecisionModel extends BaseDecisionModel {
  lc_namespace = ['tutorials', 'decisions'];

  constructor(model: string) {
    super({ model });
  }

  get _provider(): string {
    return 'deepseek';
  }

  async _classify(
    state: State,
    questions: Record<string, Question>,
  ): Promise<ClassifierResponse> {
    const chat = createChatModel({ temperature: 0 });
    const prompt = [
      '你是决策模型。阅读输入，回答每个类型化问题。',
      `输入：${typeof state === 'string' ? state : JSON.stringify(state)}`,
      `问题：${JSON.stringify(questions)}`,
      '只输出一个 JSON 对象，键为问题 id，值按类型：',
      '- noul: {"type":"noul","noul":<0~1 的概率>}',
      '- choice: {"type":"choice","choice":"<标签>","probabilities":{"<标签>":<0~1>},"confidence":<0~1>}',
      '不要输出其他文字。',
    ].join('\n');
    const r = await chat.invoke(prompt);
    const text = typeof r.content === 'string' ? r.content : JSON.stringify(r.content);
    const answers = JSON.parse(text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim()) as Record<string, unknown>;
    // parseClassifierResponse 校验答案形状并补全 nouls/choices/scores/boxes 视图
    return parseClassifierResponse({ model: this.model, answers });
  }
}

const classifier = new DeepSeekDecisionModel('deepseek-chat');

async function part1DirectInvoke(): Promise<void> {
  console.log('\n===== 1. 直接调用决策模型（noul + choice）=====');
  const { nouls, choices } = await classifier.invoke({
    state: '用户反馈：我们的生产服务器宕机了，影响几千个用户，必须马上处理！',
    questions: {
      urgent: { type: 'noul', instructions: '这条消息是否需要分钟级的紧急响应？' },
      team: {
        type: 'choice',
        instructions: '应该交给哪个团队处理？',
        criteria: {
          sre: '生产事故与基础设施',
          billing: '账单与支付问题',
          sales: '售前与购买咨询',
        },
      },
    },
  });
  console.log(`- urgent（“是”的概率）: ${nouls.urgent.noul}`);
  console.log(`- team（选择）: ${choices.team.choice}（置信度 ${choices.team.confidence}）`);
}

/**
 * modelRouterMiddleware（1.6.5）：用一个决策模型在运行前给请求选模型，
 * 完整 ChoiceAnswer（含概率/置信度）存进 state.modelRoute，可在状态与链路里审计。
 */
async function part2ModelRouter(): Promise<void> {
  console.log('\n===== 2. modelRouterMiddleware：决策模型做模型路由 =====');
  const router = modelRouterMiddleware({
    choices: {
      fast: {
        model: createChatModel({ temperature: 0.3 }),
        criteria: '闲聊、翻译、简单问答等轻任务',
      },
      powerful: {
        model: createChatModel({ model: 'deepseek-reasoner', temperature: 0.3 }),
        criteria: '多步推理、数学、代码审查等重任务',
      },
    },
    instructions: '为用户请求选择成本最低但能胜任的模型。',
    classifier,
  });
  const agent = createAgent({ model: createChatModel(), middleware: [router] });
  const result = await agent.invoke({
    messages: [{ role: 'user', content: '3.11 和 2.99 哪个大？请给出推理过程' }],
  });
  const route = (result as { modelRoute?: { choice?: string; confidence?: number } }).modelRoute;
  if (route) console.log(`- 路由结果: ${route.choice}（置信度 ${route.confidence}）`);
  const last = result.messages[result.messages.length - 1];
  console.log('- 回答:', typeof last.content === 'string' ? last.content : JSON.stringify(last.content));
}

/**
 * autoModeMiddleware（1.6.5）：工具执行前由决策模型评估风险，
 * 风险概率 >= 0.5 的调用被拦截（返回错误 ToolMessage），不执行工具。
 * 只拦截 tools 列表里的工具，其余工具直接放行。
 */
async function part3AutoMode(): Promise<void> {
  console.log('\n===== 3. autoModeMiddleware：决策模型守门危险工具 =====');
  const readDocs = tool(
    () => '项目文档：本系统是一个教程示例。',
    {
      name: 'read_project_docs',
      description: '读取项目文档（只读、安全）',
      schema: z.object({ path: z.string().describe('文档路径') }),
    },
  );
  const deleteFile = tool(
    ({ path }) => `已删除 ${path}`,
    {
      name: 'delete_production_file',
      description: '删除生产环境文件（危险操作）',
      schema: z.object({ path: z.string().describe('文件路径') }),
    },
  );
  const guard = autoModeMiddleware({
    tools: ['delete_production_file'],
    classifier,
    instructions: '判断这次工具调用是否有破坏性或未经授权。',
    criteria: {
      true: '会写入、删除、发布或改变访问权限',
      false: '只读取公开或用户提供的数据',
    },
  });
  const agent = createAgent({
    model: createChatModel(),
    tools: [readDocs, deleteFile],
    middleware: [guard],
  });
  const result = await agent.invoke({
    messages: [{ role: 'user', content: '先读一下 docs/overview.md，然后删除生产环境的 logs/error.log' }],
  });
  for (const m of result.messages) {
    if (m.getType() === 'tool') {
      console.log(`- 工具结果: ${typeof m.content === 'string' ? m.content : JSON.stringify(m.content)}`);
    }
  }
}

/**
 * modelRefusalMiddleware（1.6.4）：供应商把“安全拒绝”作为成功响应返回时，
 * 检查响应里的 refusal content block 并抛 ModelRefusalError——
 * 官方建议放在 modelFallbackMiddleware 之后，由 fallback 换模型重试
 * （modelRetryMiddleware 不重试拒绝）。DeepSeek 不返回 refusal block，
 * 这里只演示接线。
 */
function part4ModelRefusal(): void {
  console.log('\n===== 4. modelRefusalMiddleware：拒绝即失败（接线演示）=====');
  createAgent({
    model: createChatModel(),
    middleware: [modelRefusalMiddleware()],
  });
  console.log('- 已创建带 modelRefusalMiddleware 的 agent，生产环境请与 modelFallbackMiddleware 组合使用');
}

async function main(): Promise<void> {
  await part1DirectInvoke();
  await part2ModelRouter();
  await part3AutoMode();
  part4ModelRefusal();
}

main();
