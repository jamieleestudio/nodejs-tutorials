import type {
  EmbeddingModelV4,
  EmbeddingModelV4CallOptions,
  EmbeddingModelV4Result,
} from '@ai-sdk/provider';
import { pipeline, env, type FeatureExtractionPipeline } from '@huggingface/transformers';

// 国内网络直连 huggingface.co 超时，切镜像（与 langchainjs-rag 同一做法）
env.remoteHost = 'https://hf-mirror.com';

/**
 * 本地中文嵌入，实现 AI SDK 的 EmbeddingModelV4 接口——
 * 让 embed()/embedMany()/cosineSimilarity 直接吃本地 ONNX 模型，零 API key。
 *
 * （Xenova/bge-small-zh-v1.5，与 langchainjs-shared 的 LocalBGEEmbeddings 同一模型。
 * DeepSeek 不提供嵌入 API，因此 RAG 模块全部走本地推理。首次运行下载模型约 30MB。）
 */
export class LocalBGEEmbeddingModel implements EmbeddingModelV4 {
  readonly specificationVersion = 'v4' as const;
  readonly provider = 'vercelai.shared';
  readonly modelId = 'Xenova/bge-small-zh-v1.5';

  /** 每次 API 调用（这里是本地一次前向）最多嵌入的条数，SDK 据此自动分批 */
  readonly maxEmbeddingsPerCall: number = 16;
  readonly supportsParallelCalls = false;

  private extractor: FeatureExtractionPipeline | null = null;

  private async getExtractor(): Promise<FeatureExtractionPipeline> {
    if (!this.extractor) {
      this.extractor = await pipeline('feature-extraction', this.modelId);
    }
    return this.extractor;
  }

  async doEmbed({
    values,
    abortSignal,
  }: EmbeddingModelV4CallOptions): Promise<EmbeddingModelV4Result> {
    if (abortSignal?.aborted) {
      throw new Error('嵌入请求已中止');
    }
    const extractor = await this.getExtractor();
    const output = await extractor(values, { pooling: 'cls', normalize: true });
    const embeddings = output.tolist() as number[][];
    // 本地推理无真实 token 计量，粗略估算仅作展示（usage 可选字段）
    return {
      embeddings,
      usage: { tokens: values.reduce((n, v) => n + Math.ceil(v.length / 2), 0) },
      warnings: [],
    };
  }
}
