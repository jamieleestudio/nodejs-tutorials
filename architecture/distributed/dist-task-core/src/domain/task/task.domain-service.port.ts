export interface TaskShard {
  workerIndex: number;
  payload: string;
}

export const TASK_DOMAIN_SERVICE = Symbol("TASK_DOMAIN_SERVICE");

export interface TaskDomainService {
  shard(payload: string, workerCount: number): TaskShard[];
  aggregateResults(shards: TaskShard[], workerResults: Map<number, string>): string;
}