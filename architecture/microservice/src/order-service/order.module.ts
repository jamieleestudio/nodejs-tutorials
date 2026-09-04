/**
 * OrderServiceModule — 订单服务模块
 *
 * 注册：
 * - OrderController（HTTP 入口）
 * - OrderDomainService / OrderApplicationService（通过 token 绑定）
 * - Repository 实现
 * - UserServiceClient（连接到 User 微服务的 TCP 客户端，实现 UserLookupPort）
 *
 * ClientProxy 通过 registerAs() 绑定到 User 微服务的 TCP 地址。
 */

import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { OrderController } from "./interfaces/order.controller.js";
import { ORDER_REPOSITORY } from "./domain/order/order.repository.port.js";
import { ORDER_DOMAIN_SERVICE } from "./domain/order/order.domain-service.port.js";
import { ORDER_APPLICATION_SERVICE } from "./application/order.application-service.port.js";
import { USER_LOOKUP_PORT } from "./domain/order/order-lookup.port.js";
import { PrismaService } from "./infrastructure/persistence/prisma.service.js";
import { PrismaOrderRepository } from "./infrastructure/persistence/order.repository.impl.js";
import { OrderDomainServiceImpl } from "./domain/order/impl/order.domain-service.impl.js";
import { OrderApplicationServiceImpl } from "./application/impl/order.application-service.impl.js";
import { UserServiceClient } from "./infrastructure/client/user-service.client.js";

@Module({
  imports: [
    // 注册 TCP 客户端连接到 User 微服务
    ClientsModule.registerAsync([
      {
        name: "USER_SERVICE_CLIENT",
        useFactory: () => ({
          transport: Transport.TCP,
          options: {
            host: "127.0.0.1",
            port: parseInt(process.env.USER_SERVICE_PORT ?? "4001", 10),
          },
        }),
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [
    PrismaService,
    { provide: ORDER_REPOSITORY, useClass: PrismaOrderRepository },
    UserServiceClient,
    { provide: USER_LOOKUP_PORT, useExisting: UserServiceClient },
    { provide: ORDER_DOMAIN_SERVICE, useClass: OrderDomainServiceImpl },
    { provide: ORDER_APPLICATION_SERVICE, useClass: OrderApplicationServiceImpl },
  ],
})
export class OrderServiceModule {}