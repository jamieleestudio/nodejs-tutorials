/**
 * WorkerDispatcher — 分发任务分片到 Worker 的端口（由 application 层定义）
 *
 * 分层修正：原实现 application 直接 import infrastructure 的 WorkerClient；
 * 拆包后端口留在 @dist/task-core，HTTP 适配器（WorkerClient）由 @dist/master 提供。
 */

import { TaskShard } from "../../domain/task/task.domain-service.port.js";

export interface WorkerResult {
  workerUrl: string;
  result: string;
  status: string;
}

export const WORKER_DISPATCHER = Symbol("WORKER_DISPATCHER");

export interface WorkerDispatcher {
  dispatchShards(
    taskId: string,
    shards: TaskShard[],
    workerUrls: string[],
  ): Promise<WorkerResult[]>;
}
