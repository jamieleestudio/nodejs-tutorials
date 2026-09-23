/**
 * OrderModule — 订单服务装配
 *
 * HttpUserLookup 的目标地址来自 env USER_SERVICE_URL（12-Factor Config）。
 */

import { Module, FactoryProvider } from "@nestjs/common";
import { USER_LOOKUP_PORT } from "./domain/order/user-lookup.port.js";
import { ORDER_REPOSITORY } from "./domain/order/order.entity.js";
import { OrderService } from "./application/order.service.js";
import { PrismaService } from "./infrastructure/persistence/prisma.service.js";
import { PrismaOrderRepository } from "./infrastructure/persistence/order.repository.impl.js";
import { HttpUserLookup } from "./infrastructure/client/http-user-lookup.js";
import { OrderController } from "./interfaces/order.controller.js";

const USER_SERVICE_URL: FactoryProvider<string> = {
  provide: "USER_SERVICE_URL",
  useFactory: () => process.env.USER_SERVICE_URL ?? "http://127.0.0.1:4400",
};

@Module({
  controllers: [OrderController],
  providers: [
    PrismaService,
    { provide: ORDER_REPOSITORY, useClass: PrismaOrderRepository },
    USER_SERVICE_URL,
    { provide: HttpUserLookup, useFactory: (url: string) => new HttpUserLookup(url), inject: ["USER_SERVICE_URL"] },
    { provide: USER_LOOKUP_PORT, useExisting: HttpUserLookup },
    OrderService,
  ],
})
export class OrderModule {}
