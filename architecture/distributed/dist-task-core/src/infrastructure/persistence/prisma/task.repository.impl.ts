/** PrismaTaskRepository — Task 仓储实现 */
import { Injectable } from "@nestjs/common";
import { Task } from "../../../domain/task/task.entity.js";
import { TaskRepository } from "../../../domain/task/task.repository.port.js";
import { PrismaService } from "./prisma.service.js";
import { TaskMapper } from "../mappers/task.mapper.js";

@Injectable()
export class PrismaTaskRepository implements TaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Task | null> {
    const r = await this.prisma.task.findUnique({ where: { id } });
    return r ? TaskMapper.toDomain(r) : null;
  }

  async save(task: Task): Promise<void> {
    const data = TaskMapper.toPersistence(task);
    await this.prisma.task.upsert({
      where: { id: data.id },
      create: data,
      update: { result: data.result, status: data.status, workerId: data.workerId, updatedAt: data.updatedAt },
    });
  }

  async findAll(): Promise<Task[]> {
    const records = await this.prisma.task.findMany({ orderBy: { createdAt: "asc" } });
    return records.map((r) => TaskMapper.toDomain(r));
  }

  async findPending(): Promise<Task[]> {
    const records = await this.prisma.task.findMany({ where: { status: "PENDING" } });
    return records.map((r) => TaskMapper.toDomain(r));
  }
}