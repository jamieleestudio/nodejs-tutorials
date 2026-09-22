import { createAgent, tool } from 'langchain';
import { ChatOpenAI } from '@langchain/openai';
import { z } from 'zod';
import { createChatModel } from 'langchainjs-shared';

/**
 * RBAC 中间件：middleware 的 wrapToolCall 钩子在每次工具执行前拦截，
 * 按当前用户角色校验工具权限 —— 越权调用直接返回拒绝，不触达工具。
 *
 * 对照 Java 侧：SAA 的 Permission 模型 / Spring Security 方法级鉴权。
 */
const rolePermissions: Record<string, string[]> = {
  admin: ['*'],
  member: ['read_*', 'list_*'],
  guest: ['read_public_*'],
};

function isAllowed(role: string, toolName: string): boolean {
  const patterns = rolePermissions[role] ?? [];
  return patterns.some((p) => p === '*' || toolName.startsWith(p.replace(/\*/g, '')));
}

const rbacMiddleware = {
  name: 'rbac-middleware',
  wrapToolCall: async (handler, request) => {
    const role = (request.runtime?.configurable?.role as string) ?? 'guest';
    const toolName = request.toolCall?.name ?? request.tool?.name ?? '';
    if (!isAllowed(role, toolName)) {
      console.log(`- [RBAC 拦截] 角色 ${role} 无权调用 ${toolName}`);
      return {
        result: `权限拒绝：角色 ${role} 无权调用工具 ${toolName}`,
      };
    }
    return handler(request);
  },
};

const adminOnlyTool = tool(
  (input) => `已删除 ${input.target}`,
  {
    name: 'delete_data',
    description: '删除指定数据（仅管理员）',
    schema: z.object({ target: z.string() }),
  },
);

const readTool = tool(
  (input) => `公共信息：${input.query} 的查询结果`,
  {
    name: 'read_public_info',
    description: '查询公共信息',
    schema: z.object({ query: z.string() }),
  },
);

const agent = createAgent({
  model: new ChatOpenAI({
    model: 'deepseek-chat',
    apiKey: process.env.DEEPSEEK_API_KEY,
    configuration: { baseURL: 'https://api.deepseek.com' },
  }),
  tools: [adminOnlyTool, readTool],
  middleware: [rbacMiddleware],
});

async function main(): Promise<void> {
  // member 请求删除 → RBAC 拦截
  const r1 = await agent.invoke(
    { messages: [{ role: 'user', content: '删除 user-1002 的数据' }] },
    { configurable: { userId: 'u-1001', role: 'member' } },
  );
  const l1 = r1.messages[r1.messages.length - 1];
  console.log('[member 删除]', typeof l1.content === 'string' ? l1.content : '');

  // member 请求读取 → 放行
  const r2 = await agent.invoke(
    { messages: [{ role: 'user', content: '帮我查一下系统公告' }] },
    { configurable: { userId: 'u-1001', role: 'member' } },
  );
  const l2 = r2.messages[r2.messages.length - 1];
  console.log('[member 读取]', typeof l2.content === 'string' ? l2.content : '');
}

main();
