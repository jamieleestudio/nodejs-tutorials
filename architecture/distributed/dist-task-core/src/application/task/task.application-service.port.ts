import { DispatchTaskCommand } from "./commands/dispatch-task.command.js";
import { ExecuteShardCommand } from "./commands/execute-shard.command.js";
import { GetTaskQuery } from "./queries/get-task.query.js";
import { TaskDto } from "./dto/task.dto.js";
import type { WorkerResult } from "./worker-dispatcher.port.js";

export const TASK_APPLICATION_SERVICE = Symbol("TASK_APPLICATION_SERVICE");

export interface TaskApplicationService {
  dispatchTaskCommand(command: DispatchTaskCommand): Promise<{ task: TaskDto; workerResults: WorkerResult[] }>;
  executeShardCommand(command: ExecuteShardCommand): Promise<TaskDto>;
  getTaskQuery(query: GetTaskQuery): Promise<TaskDto>;
}