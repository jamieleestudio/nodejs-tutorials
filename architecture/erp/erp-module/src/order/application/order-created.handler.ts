/** OrderCreatedEventHandler — 订单事件的进程内订阅者（演示 EventBus） */
import { Inject, Injectable, Logger } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { OrderCreatedEvent } from "../domain/order.entity.js";

@Injectable()
@EventsHandler(OrderCreatedEvent)
export class OrderCreatedEventHandler implements IEventHandler<OrderCreatedEvent> {
  private readonly logger = new Logger(OrderCreatedEventHandler.name);

  constructor() {}

  async handle(event: OrderCreatedEvent): Promise<void> {
    this.logger.log(
      `⚡ OrderCreatedEvent handled: order ${event.orderId} (user ${event.userId}, amount ${event.amount})`,
    );
  }
}
