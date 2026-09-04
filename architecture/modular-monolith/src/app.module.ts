/**
 * AppModule — Modular Monolith 根模块（重构后）
 *
 * 重构变化：
 * - 移除 CqrsModule 中的 CommandBus/QueryBus 用法
 * - 8 个 CommandHandler/QueryHandler → 1 个 OrderApplicationService
 * - OrderDomainService / OrderApplicationService 通过 port + impl 分离
 * - 采用 DI token（ORDER_DOMAIN_SERVICE / ORDER_APPLICATION_SERVICE）注入
 * - 保留 EventBus（仍用于发布领域事件，实现模块解耦）
 * - 保留 OrderCreatedEventHandler（跨模块事件监听）
 *
 * 模块解耦不变：
 * - Order 模块通过 EventBus 发布事件
 * - User 模块通过 @EventsHandler 监听事件
 * - 两个模块不直接 import
 */

import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { OrderController } from "./interfaces/order/order.controller.js";
import { PersistenceModule } from "./infrastructure/persistence/prisma/persistence.module.js";
import { ORDER_APPLICATION_SERVICE } from "./application/order/order.application-service.port.js";
import { OrderApplicationServiceImpl } from "./application/order/impl/order.application-service.impl.js";
import { ORDER_DOMAIN_SERVICE } from "./domain/order/order.domain-service.port.js";
import { OrderDomainServiceImpl } from "./domain/order/impl/order.domain-service.impl.js";
import { OrderCreatedEventHandler } from "./application/user/handlers/order-created.handler.js";

@Module({
  imports: [CqrsModule, PersistenceModule],
  controllers: [OrderController],
  providers: [
    { provide: ORDER_DOMAIN_SERVICE, useClass: OrderDomainServiceImpl },
    { provide: ORDER_APPLICATION_SERVICE, useClass: OrderApplicationServiceImpl },
    OrderCreatedEventHandler,
  ],
})
export class AppModule {}