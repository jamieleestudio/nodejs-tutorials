/**
 * OrderApplicationService — 创建订单后发布集成事件
 *
 * 事件驱动的核心：订单服务只管"发布"，
 * 谁消费、消费后做什么，完全不关心。
 */

import { Inject, Injectable } from "@nestjs/common";
import { RedisEventBus } from "@eda/event-bus";
import { OrderCreatedPayload, TOPICS } from "@eda/shared-kernel";
import { ORDER_REPOSITORY, Order, OrderRepository } from "../domain/order/order.entity.js";

export interface CreateOrderInput {
  userId: string;
  amount: number;
}

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository,
    private readonly eventBus: RedisEventBus,
  ) {}

  async createOrder(input: CreateOrderInput): Promise<Order> {
    const order = Order.create(input);
    await this.orderRepository.save(order);

    // 事务提交后发布集成事件（Redis pub/sub）
    const payload: OrderCreatedPayload = {
      orderId: order.id,
      userId: order.userId,
      amount: order.amount,
    };
    await this.eventBus.publish(TOPICS.ORDER_CREATED, payload);

    return order;
  }

  async getOrder(id: string): Promise<Order | null> {
    return this.orderRepository.findById(id);
  }
}
