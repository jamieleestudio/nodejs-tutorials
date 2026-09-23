/**
 * TaskCoreModule — Task 业务核心（domain + application + infrastructure）
 *
 * Master 与 Worker 都导入本模块：
 * - Master：HTTP /tasks/compute（分发分片）
 * - Worker：HTTP /tasks/execute（执行分片）
 * - WORKER_DISPATCHER 由宿主（master/worker）各自提供
 */

import { Module } from "@nestjs/common";
import { TASK_REPOSITORY } from "./domain/task/task.repository.port.js";
import { TASK_DOMAIN_SERVICE } from "./domain/task/task.domain-service.port.js";
import { TASK_APPLICATION_SERVICE } from "./application/task/task.application-service.port.js";
import { TaskDomainServiceImpl } from "./domain/task/impl/task.domain-service.impl.js";
import { TaskApplicationServiceImpl } from "./application/task/impl/task.application-service.impl.js";
import { TaskPersistenceModule } from "./infrastructure/persistence/prisma/persistence.module.js";

@Module({
  imports: [TaskPersistenceModule],
  providers: [
    { provide: TASK_DOMAIN_SERVICE, useClass: TaskDomainServiceImpl },
    { provide: TASK_APPLICATION_SERVICE, useClass: TaskApplicationServiceImpl },
  ],
  exports: [TaskPersistenceModule, TASK_REPOSITORY, TASK_DOMAIN_SERVICE, TASK_APPLICATION_SERVICE],
})
export class TaskCoreModule {}
