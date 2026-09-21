import { LocalBGEEmbeddings } from 'langchainjs-shared';

/**
 * 嵌入基础：embedDocuments 批量嵌入 + 余弦相似度对比，无 API key。
 * 首次运行会从 Hugging Face 镜像下载模型文件（约 30MB）。
 */
async function main(): Promise<void> {
  const embeddings = new LocalBGEEmbeddings();

  const texts = [
    '工作流用 StateGraph 声明节点与边',
    '跑步后膝盖疼痛需要休息与康复训练',
  ];
  const [a, b] = await embeddings.embedDocuments(texts);
  console.log('- 向量维度:', a.length);

  const query = await embeddings.embedQuery('工作流怎么声明？');

  const cosine = (x: number[], y: number[]) => {
    const dot = x.reduce((s, v, i) => s + v * y[i], 0);
    const na = Math.sqrt(x.reduce((s, v) => s + v * v, 0));
    const nb = Math.sqrt(y.reduce((s, v) => s + v * v, 0));
    return dot / (na * nb);
  };

  console.log('- 与「工作流」相似度:', cosine(query, a).toFixed(4));
  console.log('- 与「膝盖」相似度:', cosine(query, b).toFixed(4));
}

main();