import { mastra } from './mastra/index.ts';

const agent = mastra.getAgentById('streaming-agent');

// textStream：逐 token 增量输出（对照 Java 侧 ChatModel.stream 返回 Flux<String>）
const stream = await agent.stream('写一首关于春天的五言绝句');
for await (const chunk of stream.textStream) {
  process.stdout.write(chunk);
}
process.stdout.write('\n');

// fullStream：完整事件流（含工具调用、finish 原因等元数据）
let events = 0;
const full = await agent.stream('用一句话介绍 Reactor');
for await (const chunk of full.fullStream) {
  events++;
  if (events <= 3) console.log('chunk.type =', chunk.type);
}
console.log('总事件数:', events);
console.log('finishReason:', await full.finishReason);
console.log('最终文本:', await full.text);
