/**
 * Order 领域实体（聚合根）
 *
 * 继承 AggregateRoot，在创建订单时收集 OrderCreatedEvent。
 * 外部通过 Order 聚合根操作，不直接访问内部状态。
 */

import { AggregateRoot } from "../shared/aggregate-root.base.js";
import { OrderStatus } from "./order-status.value-object.js";
import { OrderCreatedEvent } from "./events/order-created.event.js";

export class Order extends AggregateRoot<string> {
  private _userId: string;
  private _amount: number;
  private _status: OrderStatus;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: string, userId: string, amount: number, status: OrderStatus,
    createdAt: Date, updatedAt: Date,
  ) {
    super(id);
    this._userId = userId;
    this._amount = amount;
    this._status = status;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  /**
   * 工厂方法：创建新订单
   * 创建时自动收集 OrderCreatedEvent 域事件
   */
  static create(params: { id?: string; userId: string; amount: number }): Order {
    const now = new Date();
    const order = new Order(
      params.id ?? crypto.randomUUID(),
      params.userId,
      Order.validateAmount(params.amount),
      OrderStatus.pending(),
      now, now,
    );
    // 收集领域事件，由 application 层在事务后发布到 EventBus
    order.addEvent(new OrderCreatedEvent(order.id, order._userId, order._amount));
    return order;
  }

  static reconstitute(params: {
    id: string; userId: string; amount: number; status: OrderStatusValue;
    createdAt: Date; updatedAt: Date;
  }): Order {
    return new Order(
      params.id, params.userId, params.amount,
      OrderStatus.create(params.status),
      params.createdAt, params.updatedAt,
    );
  }

  get userId(): string { return this._userId; }
  get amount(): number { return this._amount; }
  get status(): OrderStatus { return this._status; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  /** 确认订单 */
  confirm(): void {
    this._status = this._status.transitionTo("CONFIRMED");
    this._updatedAt = new Date();
  }

  /** 取消订单 */
  cancel(): void {
    this._status = this._status.transitionTo("CANCELLED");
    this._updatedAt = new Date();
  }

  private static validateAmount(amount: number): number {
    if (amount <= 0) throw new Error("Order amount must be positive");
    return amount;
  }
}

// 需要导入 OrderStatusValue 类型用于 reconstitute 参数
import { OrderStatusValue } from "./order-status.value-object.js";