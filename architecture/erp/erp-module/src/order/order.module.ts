/** ErpOrderModule — 订单模块装配 */
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { ORDER_REPOSITORY } from "./domain/order.entity.js";
import { OrderService } from "./application/order.service.js";
import { OrderCreatedEventHandler } from "./application/order-created.handler.js";
import { PrismaOrderRepository } from "./infrastructure/order.repository.impl.js";
import { OrderController } from "./interfaces/order.controller.js";
import { ErpUserModule } from "../user/user.module.js";

@Module({
  imports: [CqrsModule, ErpUserModule],
  controllers: [OrderController],
  providers: [
    { provide: ORDER_REPOSITORY, useClass: PrismaOrderRepository },
    OrderService,
    OrderCreatedEventHandler,
  ],
})
export class ErpOrderModule {}
