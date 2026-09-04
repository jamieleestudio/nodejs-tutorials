/**
 * WorkerClient — Master → Worker HTTP 通信客户端
 *
 * 重构后：支持分片分发（每个 worker 收到对应的 payload 分片）。
 */

import { Injectable } from "@nestjs/common";
import { TaskShard } from "../../domain/task/task.domain-service.port.js";

export interface WorkerResult {
  workerUrl: string;
  result: string;
  status: string;
}

@Injectable()
export class WorkerClient {
  /**
   * 并行分发任务分片到多个 worker
   * 每个 worker 收到自己的 payload 分片
   */
  async dispatchShards(
    taskId: string,
    shards: TaskShard[],
    workerUrls: string[],
  ): Promise<WorkerResult[]> {
    const results = await Promise.all(
      shards.map(async (shard) => {
        const workerUrl = workerUrls[shard.workerIndex];
        try {
          const res = await fetch(`${workerUrl}/tasks/execute`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              taskId,
              workerId: workerUrl,
              payload: shard.payload,
            }),
          });
          const data = await res.json() as { result: string; status: string };
          return { workerUrl, result: data.result, status: data.status };
        } catch (error) {
          return {
            workerUrl,
            result: `error: ${(error as Error).message}`,
            status: "FAILED",
          };
        }
      }),
    );
    return results;
  }
}