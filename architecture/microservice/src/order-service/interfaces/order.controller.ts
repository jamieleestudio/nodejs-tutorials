/**
 * Order HTTP Controller — Order 服务的 HTTP 入口
 *
 * 与 User 微服务不同，Order 服务同时暴露 HTTP：
 * - HTTP：供外部客户端调用（POST /orders）
 * - 应用服务内部通过 TCP ClientProxy 调用 User 微服务
 */

import { Controller, Post, Get, Body, Param, ValidationPipe, Inject } from "@nestjs/common";
import { IsString, IsNumber, Min } from "class-validator";
import { ORDER_APPLICATION_SERVICE, OrderApplicationService } from "../application/order.application-service.port.js";
import { CreateOrderCommand } from "../application/commands/create-order.command.js";
import { GetOrderQuery } from "../application/queries/get-order.query.js";

class CreateOrderRequestDto {
  @IsString()
  userId!: string;

  @IsNumber()
  @Min(0.01)
  amount!: number;
}

@Controller("orders")
export class OrderController {
  constructor(
    @Inject(ORDER_APPLICATION_SERVICE) private readonly orderAppService: OrderApplicationService,
  ) {}

  @Post()
  async create(@Body(new ValidationPipe({ whitelist: true })) body: CreateOrderRequestDto) {
    return this.orderAppService.createOrderCommand(new CreateOrderCommand(body.userId, body.amount));
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.orderAppService.getOrderQuery(new GetOrderQuery(id));
  }
}