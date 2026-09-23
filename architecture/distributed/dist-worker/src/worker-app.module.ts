/**
 * WorkerAppModule — Worker 节点模块
 *
 * 导入 @dist/task-core（与 Master 共享业务核心），
 * 只暴露 execute 端点（接收 Master 分发的分片任务）。
 */

import { Module, Controller, Post, Body, Inject } from "@nestjs/common";
import { TASK_APPLICATION_SERVICE, TaskApplicationService, TaskCoreModule } from "@dist/task-core";
import { ExecuteShardCommand } from "@dist/task-core";

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
  imports: [TaskCoreModule],
  controllers: [WorkerTaskController],
})
export class WorkerAppModule {}
