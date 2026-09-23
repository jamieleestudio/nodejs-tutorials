/** Order HTTP Controller + 健康检查 */
import { Controller, Post, Get, Body, Param, ValidationPipe, Inject } from "@nestjs/common";
import { IsNumber, IsString, Min } from "class-validator";
import { OrderService } from "../application/order.service.js";

class CreateOrderRequestDto {
  @IsString()
  userId!: string;

  @IsNumber()
  @Min(0.01)
  amount!: number;
}

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /** Kubernetes liveness/readiness probe */
  @Get("healthz")
  health() {
    return { status: "ok", service: "cn-order-service", time: new Date().toISOString() };
  }

  @Post("orders")
  async create(@Body(new ValidationPipe({ whitelist: true })) body: CreateOrderRequestDto) {
    const order = await this.orderService.createOrder(body);
    return { id: order.id, userId: order.userId, amount: order.amount, status: order.status };
  }

  @Get("orders/:id")
  async findOne(@Param("id") id: string) {
    const order = await this.orderService.getOrder(id);
    if (!order) return { statusCode: 404, message: `Order "${id}" not found` };
    return { id: order.id, userId: order.userId, amount: order.amount, status: order.status };
  }
}
