/** OrderService — 订单服务（REST 调用 User 服务验证） */
import { Inject, Injectable } from "@nestjs/common";
import { Order, ORDER_REPOSITORY, OrderRepository } from "../domain/order/order.entity.js";
import { USER_LOOKUP_PORT, UserLookupPort } from "../domain/order/user-lookup.port.js";

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository,
    @Inject(USER_LOOKUP_PORT) private readonly userLookup: UserLookupPort,
  ) {}

  async createOrder(input: { userId: string; amount: number }): Promise<Order> {
    const user = await this.userLookup.getUserById(input.userId);
    if (!user) throw new Error(`User "${input.userId}" not found (backing service)`);
    const order = Order.create(input);
    await this.orderRepository.save(order);
    return order;
  }

  async getOrder(id: string): Promise<Order | null> {
    return this.orderRepository.findById(id);
  }
}
