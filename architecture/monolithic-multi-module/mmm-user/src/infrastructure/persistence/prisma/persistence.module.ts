/**
 * UserPersistenceModule — User 上下文的持久化装配
 *
 * 通过 DI 绑定：
 * - USER_REPOSITORY → PrismaUserRepository
 * - PrismaService（@mmm/user 自己的 Prisma Client，独立数据库 arch_mmm_user）
 */

import { Module } from "@nestjs/common";
import { USER_REPOSITORY } from "../../../domain/user/user.repository.port.js";
import { PrismaService } from "./prisma.service.js";
import { PrismaUserRepository } from "./user.repository.impl.js";

@Module({
  providers: [
    PrismaService,
    { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
  ],
  exports: [PrismaService, USER_REPOSITORY],
})
export class UserPersistenceModule {}
