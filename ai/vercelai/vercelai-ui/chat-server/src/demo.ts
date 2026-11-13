/**
 * AI SDK 7 UI 层：useChat 协议服务端（Hono）+ 纯 fetch SSE 消费页
 *
 * 服务端三步：convertToModelMessages（UIMessage → 模型消息）→ streamText →
 * toUIMessageStream + createUIMessageStreamResponse（v7 转正的独立函数；
 * 旧的 result.toUIMessageStreamResponse() 方法已 deprecated）。
 * 协议是框架无关的 SSE（UIMessageChunk 逐条 data: ...，以 data: [DONE] 结束）——
 * 配 @ai-sdk/react 的 useChat 即完整 React 前端；这里用纯 fetch 消费证明协议开放性。
 *
 * 运行：pnpm --filter vercelai-ui-chat-server demo   →  http://localhost:8628
 */
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import {
  streamText,
  convertToModelMessages,
  toUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
} from 'ai';
import { createChatModel } from 'vercelai-shared';

const app = new Hono();

// ---- 协议端点：接收 useChat 的 messages，返回 UI message stream ----
app.post('/chat', async (c) => {
  const { messages } = (await c.req.json()) as { messages: UIMessage[] };

  const result = streamText({
    model: createChatModel(),
    instructions: '你是简洁友好的中文助手，回答控制在三句话以内。',
    messages: await convertToModelMessages(messages), // v7：异步转换
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
});

// ---- 极简消费页：不用任何框架，纯 fetch 读 SSE——证明协议的开放性 ----
app.get('/', (c) =>
  c.html(`<!doctype html>
<html lang="zh">
<head>
  <meta charset="utf-8" />
  <title>vercelai chat-server (8628)</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 640px; margin: 2rem auto; padding: 0 1rem; }
    #log { border: 1px solid #ddd; border-radius: 8px; padding: 1rem; height: 320px; overflow-y: auto; white-space: pre-wrap; }
    .me { color: #0366d6; margin: .5rem 0 .2rem; }
    .ai { color: #111; margin: .2rem 0 1rem; }
    form { display: flex; gap: .5rem; margin-top: 1rem; }
    input { flex: 1; padding: .5rem; }
    button { padding: .5rem 1.2rem; }
  </style>
</head>
<body>
  <h3>AI SDK 7 useChat 协议 · 纯 fetch 消费</h3>
  <div id="log"></div>
  <form id="f">
    <input id="q" placeholder="问点什么…" autocomplete="off" />
    <button>发送</button>
  </form>
<script>
  const log = document.getElementById('log');
  const history = []; // UIMessage 数组——useChat 的核心状态，协议只要求把它原样传回
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
    const line = push('ai', '助手: ');
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = '';
    // SSE 分帧解析：data: {...}\\n\\n …… data: [DONE]\\n\\n
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
    // 把助手回答回填进 history（UIMessage 的 parts 结构），下一轮原样传回
    history.push({ role: 'assistant', parts: [{ type: 'text', text: line.textContent.slice(4) }] });
  });
</script>
</body>
</html>`),
);

serve({ fetch: app.fetch, port: 8628 }, (info) => {
  console.log(`【vercelai-ui/chat-server】http://localhost:${info.port}`);
  console.log('  GET  /chat 页面：纯 fetch 消费 SSE');
  console.log('  POST /chat      ：useChat 协议端点（@ai-sdk/react 的 useChat 可直接对接）');
  console.log('  Ctrl+C 退出');
});
