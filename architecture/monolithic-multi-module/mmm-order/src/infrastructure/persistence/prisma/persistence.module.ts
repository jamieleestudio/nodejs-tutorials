/**
 * OrderPersistenceModule — Order 上下文的持久化装配
 *
 * 通过 DI 绑定：
 * - ORDER_REPOSITORY → PrismaOrderRepository
 * - PrismaService（@mmm/order 自己的 Prisma Client，独立数据库 arch_mmm_order）
 */

import { Module } from "@nestjs/common";
import { ORDER_REPOSITORY } from "../../../domain/order/order.repository.port.js";
import { PrismaService } from "./prisma.service.js";
import { PrismaOrderRepository } from "./order.repository.impl.js";

@Module({
  providers: [
    PrismaService,
    { provide: ORDER_REPOSITORY, useClass: PrismaOrderRepository },
  ],
  exports: [PrismaService, ORDER_REPOSITORY],
})
export class OrderPersistenceModule {}
