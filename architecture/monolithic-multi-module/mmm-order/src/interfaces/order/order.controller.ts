/**
 * Order Controller — 重构后
 *
 * 变化：不再注入 CommandBus/QueryBus，改为通过 DI token 注入 OrderApplicationService。
 * 采用 CQRS 命名约定（构造 Command/Query 对象传入），但无 Bus 分发。
 * 与 CQRS 模式的区别：调用方式从 bus.execute(command) 变为 service.method(command)。
 */

import { Controller, Post, Get, Body, Param, Inject, ValidationPipe } from "@nestjs/common";
import { ORDER_APPLICATION_SERVICE, OrderApplicationService } from "../../application/order/order.application-service.port.js";
import { CreateOrderCommand } from "../../application/order/commands/create-order.command.js";
import { GetOrderQuery } from "../../application/order/queries/get-order.query.js";
import { GetOrdersByUserQuery } from "../../application/order/queries/get-orders-by-user.query.js";
import { CreateOrderRequestDto } from "./create-order.request.dto.js";

@Controller("orders")
export class OrderController {
  constructor(
    @Inject(ORDER_APPLICATION_SERVICE) private readonly orderApplicationService: OrderApplicationService,
  ) {}

  @Post()
  async create(@Body(new ValidationPipe({ whitelist: true })) body: CreateOrderRequestDto) {
    return this.orderApplicationService.createOrderCommand(
      new CreateOrderCommand(body.userId, body.amount),
    );
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.orderApplicationService.getOrderQuery(new GetOrderQuery(id));
  }

  @Get("user/:userId")
  async findByUser(@Param("userId") userId: string) {
    return this.orderApplicationService.getOrdersByUserQuery(new GetOrdersByUserQuery(userId));
  }
}