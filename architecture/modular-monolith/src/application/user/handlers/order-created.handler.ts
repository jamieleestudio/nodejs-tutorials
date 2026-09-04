/**
 * OrderCreatedEventHandler — 跨模块事件处理器
 *
 * 这是 modular-monolith 架构的核心：
 * - UserModule 监听 OrderCreatedEvent，但 **不 import OrderModule**
 * - OrderModule 发布事件后，不知道谁在监听
 * - 两个模块通过 EventBus 解耦，未来可以独立抽离为微服务
 *
 * @EventHandler 自动注册到 CQRS EventBus，
 * 当 CreateOrderCommandHandler 发布 OrderCreatedEvent 时被调用。
 */

import { Injectable, Inject, Logger } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { OrderCreatedEvent } from "../../../domain/order/events/order-created.event.js";
import { USER_REPOSITORY, UserRepository } from "../../../domain/user/user.repository.port.js";

@EventsHandler(OrderCreatedEvent)
@Injectable()
export class OrderCreatedEventHandler implements IEventHandler<OrderCreatedEvent> {
  private readonly logger = new Logger(OrderCreatedEventHandler.name);

  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
  ) {}

  async handle(event: OrderCreatedEvent): Promise<void> {
    // User 模块响应 Order 模块发出的事件，无需依赖 OrderModule
    const user = await this.userRepository.findById(event.userId);
    this.logger.log(
      `User "${user?.name ?? "unknown"}" created order ${event.orderId} (amount: ${event.amount})`,
    );
  }
}