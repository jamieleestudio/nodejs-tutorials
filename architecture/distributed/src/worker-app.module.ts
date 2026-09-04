import { Module, Controller, Post, Body, Inject } from "@nestjs/common";
import { TASK_APPLICATION_SERVICE, TaskApplicationService } from "./application/task/task.application-service.port.js";
import { ExecuteShardCommand } from "./application/task/commands/execute-shard.command.js";
import { TaskApplicationServiceImpl } from "./application/task/impl/task.application-service.impl.js";
import { TASK_DOMAIN_SERVICE } from "./domain/task/task.domain-service.port.js";
import { TaskDomainServiceImpl } from "./domain/task/impl/task.domain-service.impl.js";
import { PersistenceModule } from "./infrastructure/persistence/prisma/persistence.module.js";

@Controller("tasks")
export class WorkerTaskController {
  constructor(
    @Inject(TASK_APPLICATION_SERVICE) private readonly taskApplicationService: TaskApplicationService,
  ) {}

  @Post("execute")
  async execute(@Body() body: { taskId: string; workerId: string; payload: string }) {
    return this.taskApplicationService.executeShardCommand(
      new ExecuteShardCommand(body.taskId, body.workerId, body.payload),
    );
  }
}

@Module({
  imports: [PersistenceModule],
  controllers: [WorkerTaskController],
  providers: [
    { provide: TASK_DOMAIN_SERVICE, useClass: TaskDomainServiceImpl },
    { provide: TASK_APPLICATION_SERVICE, useClass: TaskApplicationServiceImpl },
  ],
})
export class WorkerAppModule {}