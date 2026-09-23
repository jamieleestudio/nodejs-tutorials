/**
 * TaskPersistenceModule — Task 持久化装配（独立数据库 arch_dist）
 */

import { Module } from "@nestjs/common";
import { TASK_REPOSITORY } from "../../../domain/task/task.repository.port.js";
import { PrismaService } from "./prisma.service.js";
import { PrismaTaskRepository } from "./task.repository.impl.js";

@Module({
  providers: [
    PrismaService,
    { provide: TASK_REPOSITORY, useClass: PrismaTaskRepository },
  ],
  exports: [PrismaService, TASK_REPOSITORY],
})
export class TaskPersistenceModule {}
