/**
 * GatewayModule — API 网关装配
 */

import { Module } from "@nestjs/common";
import { GatewayController, ORDER_SERVICE_URL, USER_SERVICE_URL } from "./gateway.controller.js";

@Module({
  controllers: [GatewayController],
  providers: [
    { provide: USER_SERVICE_URL, useValue: process.env.USER_SERVICE_URL ?? "http://127.0.0.1:4101" },
    { provide: ORDER_SERVICE_URL, useValue: process.env.ORDER_SERVICE_URL ?? "http://127.0.0.1:3000" },
  ],
})
export class GatewayModule {}
