/** OrderService — 订单应用服务（创建订单后通过 EventBus 发布领域事件） */
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { EventBus } from "@nestjs/cqrs";
import type { IEvent } from "@nestjs/cqrs";
import { Order, ORDER_REPOSITORY, OrderRepository } from "../domain/order.entity.js";

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository,
    private readonly eventBus: EventBus,
  ) {}

  async createOrder(input: { userId: string; amount: number }): Promise<Order> {
    const order = Order.create(input);
    await this.orderRepository.save(order);
    for (const event of order.pullEvents() as IEvent[]) {
      this.eventBus.publish(event);
    }
    return order;
  }

  async getOrder(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) throw new NotFoundException(`Order "${id}" not found`);
    return order;
  }
}
