/**
 * AI SDK 7 综合实战：智能客服
 *
 * 把前面所有模块拼成一台"完整机器"：
 *   ToolLoopAgent（agent-class）
 *   + searchFaq 工具（内部跑本地 BGE 检索——rag 模块的索引/检索原语）
 *   + lookupOrder 工具（tool-loop 的工具定义）
 *   + Hono + toUIMessageStream 的 useChat 协议服务端（ui/chat-server 同款，端口 8629）
 * 对照：langchainjs-capstone/capstone-app（LangGraph 版的同类综合）。
 *
 * 运行：pnpm --filter vercelai-capstone-support demo   →  http://localhost:8629
 */
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import {
  ToolLoopAgent,
  tool,
  stepCountIs,
  embed,
  embedMany,
  cosineSimilarity,
  convertToModelMessages,
  toUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
} from 'ai';
import { z } from 'zod';
import { createChatModel, LocalBGEEmbeddingModel } from 'vercelai-shared';

// ================= 知识层：FAQ 索引（rag 模块原语） =================

const FAQ = `
退换货政策：签收后 7 天内可无理由退货，需保持吊牌与包装完好。退款在仓库验收后 3 个工作日内原路退回。
发货时效：现货 48 小时内出库，预售商品按页面标注时间发货。默认中通，可备注顺丰（补运费差价）。
会员积分：每消费 1 元累计 1 积分，确认收货后 7 天入账；500 积分兑 10 元无门槛券，兑换入口在"我的-积分商城"。
发票：支持电子普票与增值税专票，下单时在"发票信息"填写抬头；开票金额为实付金额，发货后 24 小时内开出。
`;

const faqChunks = FAQ.split('\n').map((s) => s.trim()).filter(Boolean);

// ================= 工具层 =================

async function buildFaqSearchTool() {
  const embeddingModel = new LocalBGEEmbeddingModel();
  // 启动时建好索引（真实项目放向量库/定时任务）
  const { embeddings } = await embedMany({ model: embeddingModel, values: faqChunks });
  const index = faqChunks.map((text, i) => ({ text, vector: embeddings[i] }));
  console.log(`FAQ 索引就绪：${index.length} 条`);

  return tool({
    description: '在客服知识库里检索与问题最相关的政策条款（退换货/发货/积分/发票）',
    inputSchema: z.object({
      query: z.string().describe('要检索的问题关键词，如"积分怎么兑换"'),
    }),
    execute: async ({ query }) => {
      const { embedding: q } = await embed({ model: embeddingModel, value: query });
      return index
        .map((entry) => ({ text: entry.text, score: cosineSimilarity(q, entry.vector) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 2)
        .map((r) => r.text);
    },
  });
}

const lookupOrder = tool({
  description: '按订单号查询订单状态',
  inputSchema: z.object({
    orderId: z.string().describe('订单号，如 1001'),
  }),
  execute: async ({ orderId }) => {
    const orders: Record<string, { status: string; detail: string }> = {
      '1001': { status: '已发货', detail: '中通快递 7831****2210，预计明天送达' },
      '1002': { status: '已签收', detail: '3 天前签收，尚在 7 天无理由退货期内' },
    };
    return orders[orderId] ?? { status: '未找到', detail: `订单 ${orderId} 不存在，请核对订单号` };
  },
});

// ================= Agent 层 =================

const faqSearch = await buildFaqSearchTool();

const supportAgent = new ToolLoopAgent({
  id: 'support-agent',
  instructions:
    '你是电商客服"小唯"。回答政策类问题必须先调用 searchFaq 检索知识库，回答订单类问题必须先调用 lookupOrder；' +
    '只依据工具结果回答，知识库没有的就明确说"需要转人工"，不要编造。',
  model: createChatModel(),
  tools: { searchFaq: faqSearch, lookupOrder },
  stopWhen: stepCountIs(10),
});

// ================= 服务层：useChat 协议（ui 模块同款三步） =================

const app = new Hono();

app.post('/chat', async (c) => {
  const { messages } = (await c.req.json()) as { messages: UIMessage[] };

  // v7：agent.stream() 返回 Promise<StreamTextResult>——await 后再取 .stream；
  // convertToModelMessages 也是异步的（返回 Promise<ModelMessage[]>）
  const result = await supportAgent.stream({
    messages: await convertToModelMessages(messages),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
});

app.get('/', (c) =>
  c.html(`<!doctype html>
<html lang="zh">
<head>
  <meta charset="utf-8" />
  <title>vercelai capstone support (8629)</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 640px; margin: 2rem auto; padding: 0 1rem; }
    #log { border: 1px solid #ddd; border-radius: 8px; padding: 1rem; height: 340px; overflow-y: auto; white-space: pre-wrap; background: #fafafa; }
    .me { color: #0366d6; margin: .5rem 0 .2rem; }
    .ai { color: #111; margin: .2rem 0 1rem; }
    form { display: flex; gap: .5rem; margin-top: 1rem; }
    input { flex: 1; padding: .5rem; }
    button { padding: .5rem 1.2rem; }
    code { background: #eee; padding: 0 .3rem; border-radius: 4px; font-size: .85em; }
  </style>
</head>
<body>
  <h3>智能客服小唯 · ToolLoopAgent + RAG + 工具</h3>
  <div>试试：<code>积分怎么兑换？</code> <code>订单 1001 到哪了？</code> <code>苹果手机怎么退货？</code></div>
  <div id="log"></div>
  <form id="f">
    <input id="q" placeholder="向客服提问…" autocomplete="off" />
    <button>发送</button>
  </form>
<script>
  const log = document.getElementById('log');
  const history = [];
  function push(cls, text) {
    const p = document.createElement('div');
    p.className = cls;
    p.textContent = text;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
    return p;
  }
  document.getElementById('f').addEventListener('submit', async (e) => {
    e.preventDefault();
    const q = document.getElementById('q');
    if (!q.value.trim()) return;
    push('me', '你: ' + q.value);
    history.push({ role: 'user', parts: [{ type: 'text', text: q.value }] });
    q.value = '';

    const res = await fetch('/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messages: history }),
    });
    const line = push('ai', '小唯: ');
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const frames = buf.split('\\n\\n');
      buf = frames.pop();
      for (const frame of frames) {
        const payload = frame.replace(/^data: /, '').trim();
        if (!payload || payload === '[DONE]') continue;
        const chunk = JSON.parse(payload);
        if (chunk.type === 'text-delta') line.textContent += chunk.delta;
      }
    }
    history.push({ role: 'assistant', parts: [{ type: 'text', text: line.textContent.slice(3) }] });
  });
</script>
</body>
</html>`),
);

serve({ fetch: app.fetch, port: 8629 }, (info) => {
  console.log(`【vercelai-capstone/support】http://localhost:${info.port}`);
  console.log('  GET  /        客服对话页（纯 fetch SSE）');
  console.log('  POST /chat    useChat 协议端点');
  console.log('  架构：ToolLoopAgent ← searchFaq(本地 BGE RAG) + lookupOrder | Ctrl+C 退出');
});
