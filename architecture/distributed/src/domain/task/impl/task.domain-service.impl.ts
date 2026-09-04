import { TaskDomainService, TaskShard } from "../task.domain-service.port.js";

export class TaskDomainServiceImpl implements TaskDomainService {
  shard(payload: string, workerCount: number): TaskShard[] {
    const chunkSize = Math.ceil(payload.length / workerCount);
    const shards: TaskShard[] = [];

    for (let i = 0; i < workerCount; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, payload.length);
      if (start < end) {
        shards.push({
          workerIndex: i,
          payload: payload.slice(start, end),
        });
      }
    }

    return shards;
  }

  aggregateResults(
    shards: TaskShard[],
    workerResults: Map<number, string>,
  ): string {
    return shards
      .map((shard) => workerResults.get(shard.workerIndex) ?? "")
      .join("");
  }
}