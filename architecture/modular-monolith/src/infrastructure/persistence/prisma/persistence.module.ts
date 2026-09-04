/**
 * PersistenceModule — 注册 Prisma + User/Order Repository 实现
 *
 * 通过 DI 绑定两个 Repository token：
 * - USER_REPOSITORY → PrismaUserRepository
 * - ORDER_REPOSITORY → PrismaOrderRepository
 */
import { Module } from "@nestjs/common";
import { USER_REPOSITORY } from "../../../domain/user/user.repository.port.js";
import { ORDER_REPOSITORY } from "../../../domain/order/order.repository.port.js";
import { PrismaService } from "./prisma.service.js";
import { PrismaUserRepository } from "./user.repository.impl.js";
import { PrismaOrderRepository } from "./order.repository.impl.js";

@Module({
  providers: [
    PrismaService,
    { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
    { provide: ORDER_REPOSITORY, useClass: PrismaOrderRepository },
  ],
  exports: [USER_REPOSITORY, ORDER_REPOSITORY],
})
export class PersistenceModule {}