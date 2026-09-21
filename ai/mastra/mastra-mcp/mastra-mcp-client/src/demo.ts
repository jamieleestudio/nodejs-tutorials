import { mastra, saaClient } from './mastra/index.ts';

// 1. 发现远程 MCP 工具（listTools 返回 { serverName: 工具集合 }）
const tools = await saaClient.listTools();
console.log('远程工具清单:', JSON.stringify(tools, null, 2));

// 2. 把远程工具注入 agent 并调用
const agent = mastra.getAgentById('remote-tools-agent');
const r = await agent.generate('查一下杭州的天气', {
  toolsets: await saaClient.listToolsets(),
});
console.log('[回答]', r.text);

await saaClient.disconnect();
