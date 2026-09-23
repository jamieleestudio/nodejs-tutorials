/** OrderApplicationService — 应用服务（@Injectable，协调领域服务与仓储） */
import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { ORDER_REPOSITORY, OrderRepository } from "../../domain/order/order.repository.port.js";
import { ORDER_DOMAIN_SERVICE, OrderDomainService } from "../../domain/order/order.domain-service.port.js";
import { Order } from "../../domain/order/order.entity.js";
import { OrderDto } from "../dto/order.dto.js";
import { CreateOrderCommand } from "../commands/create-order.command.js";
import { GetOrderQuery } from "../queries/get-order.query.js";
import { OrderApplicationService } from "../order.application-service.port.js";

@Injectable()
export class OrderApplicationServiceImpl implements OrderApplicationService {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly repo: OrderRepository,
    @Inject(ORDER_DOMAIN_SERVICE) private readonly domainService: OrderDomainService,
  ) {}

  async createOrderCommand(command: CreateOrderCommand): Promise<OrderDto> {
    await this.domainService.validateUserForOrder(command.userId);
    const order = Order.create({ userId: command.userId, amount: command.amount });
    await this.repo.save(order);
    return {
      id: order.id,
      userId: order.userId,
      amount: order.amount,
      status: order.status,
    };
  }

  async getOrderQuery(query: GetOrderQuery): Promise<OrderDto> {
    const order = await this.repo.findById(query.id);
    if (!order) throw new NotFoundException(`Order "${query.id}" not found`);
    return { id: order.id, userId: order.userId, amount: order.amount, status: order.status };
  }
}