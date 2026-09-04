/**
 * Task Controller — Master 节点
 *
 * 重构后：注入 TaskApplicationService 而非 DispatchTaskUseCase。
 */

import { Controller, Post, Body, ValidationPipe, Inject } from "@nestjs/common";
import { TASK_APPLICATION_SERVICE, TaskApplicationService } from "../../application/task/task.application-service.port.js";
import { DispatchTaskCommand } from "../../application/task/commands/dispatch-task.command.js";
import { CreateTaskRequestDto } from "./create-task.request.dto.js";

@Controller("tasks")
export class TaskController {
  constructor(
    @Inject(TASK_APPLICATION_SERVICE) private readonly taskApplicationService: TaskApplicationService,
    @Inject("WORKER_URLS") private readonly workerUrls: string[],
  ) {}

  @Post("compute")
  async compute(@Body(new ValidationPipe({ whitelist: true })) body: CreateTaskRequestDto) {
    return this.taskApplicationService.dispatchTaskCommand(
      new DispatchTaskCommand(body.payload, this.workerUrls),
    );
  }
}