/** PersistenceModule */
import { Module } from "@nestjs/common";
import { TASK_REPOSITORY } from "../../../domain/task/task.repository.port.js";
import { PrismaService } from "./prisma.service.js";
import { PrismaTaskRepository } from "./task.repository.impl.js";

@Module({
  providers: [
    PrismaService,
    { provide: TASK_REPOSITORY, useClass: PrismaTaskRepository },
  ],
  exports: [TASK_REPOSITORY],
})
export class PersistenceModule {}