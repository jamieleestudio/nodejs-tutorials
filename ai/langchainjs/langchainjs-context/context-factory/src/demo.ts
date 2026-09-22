import { createAgent, tool } from 'langchain';
import { ChatOpenAI } from '@langchain/openai';
import { z } from 'zod';
import { createChatModel } from 'langchainjs-shared';

/**
 * 工厂闭包模式：每请求构建"捕获身份"的工具实例。
 *
 * 与 config 透传的取舍：
 *   - config：工具定义一次，身份运行时注入（灵活，无重建开销）
 *   - 工厂：身份编译进闭包，工具逻辑可直接引用强类型变量（类型安全，可做身份相关校验）
 *
 * 对照 Java 侧：手动构建带身份的 Bean/工具实例（Spring 的 prototype scope 思路）。
 */
interface UserContext {
  userId: string;
  role: 'member' | 'admin';
}

function makeUserTools(ctx: UserContext) {
  const auditLog: string[] = [];

  const deleteUserTool = tool(
    (input) => {
      if (ctx.role !== 'admin') {
        return `拒绝：用户 ${ctx.userId} 无删除权限`;
      }
      auditLog.push(`${ctx.userId} 删除了 ${input.target}`);
      return `已删除 ${input.target}`;
    },
    {
      name: 'delete_data',
      description: '删除指定数据（仅管理员可用）',
      schema: z.object({ target: z.string() }),
    },
  );

  const myProfileTool = tool(
    () => `当前用户 ${ctx.userId}（角色 ${ctx.role}）的资料`,
    {
      name: 'my_profile',
      description: '查询当前登录用户自己的资料',
      schema: z.object({}),
    },
  );

  return { tools: [deleteUserTool, myProfileTool], auditLog };
}

async function main(): Promise<void> {
  const model = createChatModel();

  // 请求 A：普通成员
  const member = makeUserTools({ userId: 'u-1001', role: 'member' });
  const agentA = createAgent({
    model,
    tools: member.tools,
  });
  const rA = await agentA.invoke({
    messages: [{ role: 'user', content: '删除 user-1002 的数据' }],
  });
  const lastA = rA.messages[rA.messages.length - 1];
  console.log('[member 尝试删除]', typeof lastA.content === 'string' ? lastA.content : '');

  // 请求 B：管理员
  const admin = makeUserTools({ userId: 'u-admin', role: 'admin' });
  const agentB = createAgent({
    model,
    tools: admin.tools,
  });
  const rB = await agentB.invoke({
    messages: [{ role: 'user', content: '删除 user-1002 的数据' }],
  });
  const lastB = rB.messages[rB.messages.length - 1];
  console.log('[admin 删除]', typeof lastB.content === 'string' ? lastB.content : '');
}

main();
