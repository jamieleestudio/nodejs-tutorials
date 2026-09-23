import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { Task } from "../../../domain/task/task.entity.js";
import { TASK_REPOSITORY, TaskRepository } from "../../../domain/task/task.repository.port.js";
import { TASK_DOMAIN_SERVICE, TaskDomainService } from "../../../domain/task/task.domain-service.port.js";
import { DispatchTaskCommand } from "../commands/dispatch-task.command.js";
import { ExecuteShardCommand } from "../commands/execute-shard.command.js";
import { GetTaskQuery } from "../queries/get-task.query.js";
import { TaskDto } from "../dto/task.dto.js";
import { WORKER_DISPATCHER, WorkerDispatcher, WorkerResult } from "../worker-dispatcher.port.js";
import { TaskApplicationService } from "../task.application-service.port.js";

@Injectable()
export class TaskApplicationServiceImpl implements TaskApplicationService {
  constructor(
    @Inject(TASK_REPOSITORY) private readonly taskRepository: TaskRepository,
    @Inject(TASK_DOMAIN_SERVICE) private readonly taskDomainService: TaskDomainService,
    @Inject(WORKER_DISPATCHER) private readonly workerDispatcher: WorkerDispatcher,
  ) {}

  async dispatchTaskCommand(
    command: DispatchTaskCommand,
  ): Promise<{ task: TaskDto; workerResults: WorkerResult[] }> {
    const task = Task.create({ payload: command.payload });
    await this.taskRepository.save(task);

    const shards = this.taskDomainService.shard(command.payload, command.workerUrls.length);

    const workerResults = await this.workerDispatcher.dispatchShards(
      task.id,
      shards,
      command.workerUrls,
    );

    return {
      task: this.toDto(task),
      workerResults,
    };
  }

  async executeShardCommand(command: ExecuteShardCommand): Promise<TaskDto> {
    const result = command.payload.split("").reverse().join("");

    let task = await this.taskRepository.findById(command.taskId);
    if (!task) {
      throw new NotFoundException(`Task ${command.taskId} not found`);
    }

    task.markRunning(command.workerId);
    task.markCompleted(result);
    await this.taskRepository.save(task);

    return this.toDto(task);
  }

  async getTaskQuery(query: GetTaskQuery): Promise<TaskDto> {
    const task = await this.taskRepository.findById(query.id);
    if (!task) {
      throw new NotFoundException(`Task ${query.id} not found`);
    }
    return this.toDto(task);
  }

  private toDto(task: Task): TaskDto {
    return {
      id: task.id,
      payload: task.payload,
      result: task.result,
      status: task.status,
      workerId: task.workerId,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }
}
