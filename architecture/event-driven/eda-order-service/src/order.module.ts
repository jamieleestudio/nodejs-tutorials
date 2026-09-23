/**
 * OrderServiceModule — 订单服务装配
 */

import { Module } from "@nestjs/common";
import { EventBusModule } from "@eda/event-bus";
import { ORDER_REPOSITORY } from "./domain/order/order.entity.js";
import { OrderService } from "./application/order.service.js";
import { PrismaService } from "./infrastructure/persistence/prisma.service.js";
import { PrismaOrderRepository } from "./infrastructure/persistence/order.repository.impl.js";
import { OrderController } from "./interfaces/order.controller.js";

@Module({
  imports: [EventBusModule.forRoot()],
  controllers: [OrderController],
  providers: [
    PrismaService,
    { provide: ORDER_REPOSITORY, useClass: PrismaOrderRepository },
    OrderService,
  ],
})
export class OrderServiceModule {}
