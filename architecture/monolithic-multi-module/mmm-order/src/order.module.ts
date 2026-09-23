/**
 * OrderModule — Order 限界上下文模块
 *
 * 组装：domain + application + interfaces + infrastructure
 * - 提供 HTTP /orders 端点（OrderController）
 * - 通过 EventBus 发布 OrderCreatedEvent（契约在 @mmm/shared-kernel）
 * - 依赖 @mmm/user：validateUserForOrder 需要 UserRepository（提供方定义接口）
 *
 * 依赖方向：order → user → shared-kernel（编译期单向，无环）
 */

import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { UserModule } from "@mmm/user";
import { ORDER_DOMAIN_SERVICE } from "./domain/order/order.domain-service.port.js";
import { ORDER_APPLICATION_SERVICE } from "./application/order/order.application-service.port.js";
import { OrderDomainServiceImpl } from "./domain/order/impl/order.domain-service.impl.js";
import { OrderApplicationServiceImpl } from "./application/order/impl/order.application-service.impl.js";
import { OrderController } from "./interfaces/order/order.controller.js";
import { OrderPersistenceModule } from "./infrastructure/persistence/prisma/persistence.module.js";

@Module({
  imports: [CqrsModule, UserModule, OrderPersistenceModule],
  controllers: [OrderController],
  providers: [
    { provide: ORDER_DOMAIN_SERVICE, useClass: OrderDomainServiceImpl },
    { provide: ORDER_APPLICATION_SERVICE, useClass: OrderApplicationServiceImpl },
  ],
  exports: [ORDER_APPLICATION_SERVICE],
})
export class OrderModule {}
