import { Embeddings } from '@langchain/core/embeddings';
import { pipeline, env, type FeatureExtractionPipeline } from '@huggingface/transformers';

// 国内网络直连 huggingface.co 超时，切镜像（也可设 HF_ENDPOINT）
env.remoteHost = 'https://hf-mirror.com';

/**
 * 本地中文嵌入：@huggingface/transformers 跑 ONNX 模型
 * （Xenova/bge-small-zh-v1.5），零 API key —— JS 侧对等 Java 侧
 * langchain4j-embeddings-bge-small-zh。首次运行下载模型（约 30MB）。
 */
export class LocalBGEEmbeddings extends Embeddings {
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