import { Module } from "@nestjs/common";
import { TaskController } from "./interfaces/task/task.controller.js";
import { TASK_APPLICATION_SERVICE } from "./application/task/task.application-service.port.js";
import { TaskApplicationServiceImpl } from "./application/task/impl/task.application-service.impl.js";
import { TASK_DOMAIN_SERVICE } from "./domain/task/task.domain-service.port.js";
import { TaskDomainServiceImpl } from "./domain/task/impl/task.domain-service.impl.js";
import { PersistenceModule } from "./infrastructure/persistence/prisma/persistence.module.js";
import { WorkerClient } from "./infrastructure/worker-communication/worker-client.js";

@Module({
  imports: [PersistenceModule],
  controllers: [TaskController],
  providers: [
    { provide: TASK_DOMAIN_SERVICE, useClass: TaskDomainServiceImpl },
    { provide: TASK_APPLICATION_SERVICE, useClass: TaskApplicationServiceImpl },
    WorkerClient,
    { provide: "WORKER_URLS", useValue: [] as string[] },
  ],
})
export class MasterAppModule {}