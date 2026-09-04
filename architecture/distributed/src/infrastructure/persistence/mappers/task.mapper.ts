/** Task Mapper */
import { Task, TaskStatus } from "../../../domain/task/task.entity.js";

interface TaskPrismaModel {
  id: string; payload: string; result: string | null; status: string;
  workerId: string | null; createdAt: Date; updatedAt: Date;
}

export class TaskMapper {
  static toDomain(m: TaskPrismaModel): Task {
    return Task.reconstitute({
      id: m.id, payload: m.payload, result: m.result,
      status: m.status as TaskStatus,
      workerId: m.workerId, createdAt: m.createdAt, updatedAt: m.updatedAt,
    });
  }

  static toPersistence(task: Task): TaskPrismaModel {
    return {
      id: task.id, payload: task.payload, result: task.result,
      status: task.status, workerId: task.workerId,
      createdAt: task.createdAt, updatedAt: task.updatedAt,
    };
  }
}