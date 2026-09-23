/**
 * UserModule — User 限界上下文模块
 *
 * 组装：domain + application + interfaces + infrastructure
 * - 提供 HTTP /users 端点（UserController）
 * - 订阅 OrderCreatedEvent（OrderCreatedEventHandler，通过 EventBus 解耦）
 * - 导出 USER_REPOSITORY 供 Order 上下文注入（提供方定义接口）
 */

import { Module } from "@nestjs/common";
import { USER_REPOSITORY } from "./domain/user/user.repository.port.js";
import { USER_APPLICATION_SERVICE } from "./application/user.application-service.port.js";
import { UserApplicationServiceImpl } from "./application/impl/user.application-service.impl.js";
import { OrderCreatedEventHandler } from "./application/handlers/order-created.handler.js";
import { UserController } from "./interfaces/user/user.controller.js";
import { UserPersistenceModule } from "./infrastructure/persistence/prisma/persistence.module.js";

@Module({
  imports: [UserPersistenceModule],
  controllers: [UserController],
  providers: [
    { provide: USER_APPLICATION_SERVICE, useClass: UserApplicationServiceImpl },
    OrderCreatedEventHandler,
  ],
  exports: [UserPersistenceModule, USER_REPOSITORY],
})
export class UserModule {}
