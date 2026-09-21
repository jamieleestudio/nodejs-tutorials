import { MemoryVectorStore } from '@langchain/classic/vectorstores/memory';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage } from '@langchain/core/messages';
import { createAgent, tool } from 'langchain';
import { Embeddings } from '@langchain/core/embeddings';
import { pipeline, env, type FeatureExtractionPipeline } from '@huggingface/transformers';
import { z } from 'zod';
import { createChatModel } from 'langchainjs-shared';

/**
 * 智能客服综合（LangChain.js 版）：
 *   RAG FAQ（本地 BGE-zh 嵌入 + MemoryVectorStore）+ 订单工具 + 会话记忆。
 * 对照 Java 侧 langchain4j-capstone-app 与 SAA capstone。
 */

// ---------- 本地嵌入（零 API key；首次运行下载模型） ----------
env.remoteHost = 'https://hf-mirror.com';

class LocalBGEEmbeddings extends Embeddings {
  private extractor: FeatureExtractionPipeline | null = null;

  constructor() {
    super({});
  }

  private async getExtractor(): Promise<FeatureExtractionPipeline> {
    if (!this.extractor) {
      this.extractor = await pipeline('feature-extraction', 'Xenova/bge-small-zh-v1.5');
    }
    return this.extractor;
  }

  override async embedDocuments(texts: string[]): Promise<number[][]> {
    const extractor = await this.getExtractor();
    const output = await extractor(texts, { pooling: 'cls', normalize: true });
    return output.tolist() as number[][];
  }

  override async embedQuery(text: string): Promise<number[]> {
    return (await this.embedDocuments([text]))[0];
  }
}

const faqStore = new MemoryVectorStore(new LocalBGEEmbeddings());

const FAQS = [
  '会员权益：基础版 99 元/月，专业版 299 元/月，均可随时取消。',
  '发货时效：现货商品 48 小时内发货，默认顺丰快递。',
  '退款政策：签收后 7 天内可无理由退款，需商品完好。',
];

async function ensureKnowledge(): Promise<void> {
  for (const [i, text] of FAQS.entries()) {
    await faqStore.addDocuments([{ pageContent: text, metadata: { id: `faq-${i}` } }]);
  }
}

// ---------- 工具 ----------
const orderTool = tool(
  (input) => {
    const orders: Record<string, string> = {
      '1001': '已发货，顺丰 SF1234567890，预计明日达',
      '1002': '已签收',
      '1003': '待付款',
    };
    return orders[input.orderId] ?? `订单 ${input.orderId} 不存在`;
  },
  {
    name: 'lookup_order',
    description: '按订单号查询订单状态（模拟）',
    schema: z.object({ orderId: z.string().describe('订单号，如 1001') }),
  },
);

// ---------- Agent ----------
const agent = createAgent({
  model: new ChatOpenAI({
    model: 'deepseek-chat',
    apiKey: process.env.DEEPSEEK_API_KEY,
    configuration: { baseURL: 'https://api.deepseek.com' },
  }),
  tools: [orderTool],
  prompt:
    '你是智能客服。会员/发货/退款政策问题先参考以下 FAQ 知识库：\n' +
    FAQS.join('\n') +
    '\n查订单用工具。回答友好简洁。',
});

async function main(): Promise<void> {
  await ensureKnowledge();

  const r1 = await agent.invoke({
    messages: [{ role: 'user', content: '退款政策是怎样的？' }],
  });
  console.log('[FAQ]', typeof r1.messages[r1.messages.length - 1].content === 'string'
    ? r1.messages[r1.messages.length - 1].content
    : '');

  const r2 = await agent.invoke({
    messages: [{ role: 'user', content: '订单 1001 到哪了？' }],
  });
  console.log('[订单]', typeof r2.messages[r2.messages.length - 1].content === 'string'
    ? r2.messages[r2.messages.length - 1].content
    : '');
}

main();
