/** Task 仓储接口（Port） */
import { Task } from "./task.entity.js";

export const TASK_REPOSITORY = Symbol("TASK_REPOSITORY");

export interface TaskRepository {
  findById(id: string): Promise<Task | null>;
  save(task: Task): Promise<void>;
  findAll(): Promise<Task[]>;
  findPending(): Promise<Task[]>;
}