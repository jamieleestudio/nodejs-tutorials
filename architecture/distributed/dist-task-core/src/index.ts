/**
 * @dist/task-core — 分布式架构的 Task 业务核心
 *
 * 对齐 java dist-* 的业务模块：domain + application + infrastructure。
 * Master 与 Worker 是两个可独立部署的进程，共享此核心。
 */

export { TaskCoreModule } from "./task-core.module.js";
export { TaskPersistenceModule } from "./infrastructure/persistence/prisma/persistence.module.js";
export {
  TASK_APPLICATION_SERVICE,
  TaskApplicationService,
} from "./application/task/task.application-service.port.js";
export {
  WORKER_DISPATCHER,
  WorkerDispatcher,
  WorkerResult,
} from "./application/task/worker-dispatcher.port.js";
export { TaskShard, TASK_DOMAIN_SERVICE, TaskDomainService } from "./domain/task/task.domain-service.port.js";
export { TASK_REPOSITORY, TaskRepository } from "./domain/task/task.repository.port.js";
export { Task, TaskStatus } from "./domain/task/task.entity.js";
export { DispatchTaskCommand } from "./application/task/commands/dispatch-task.command.js";
export { ExecuteShardCommand } from "./application/task/commands/execute-shard.command.js";
export type { TaskDto } from "./application/task/dto/task.dto.js";
