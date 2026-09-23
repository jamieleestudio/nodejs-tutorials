/** Order 领域（聚合根，创建时收集 OrderCreatedEvent） */
import { AggregateRoot, DomainError } from "@erp/shared-kernel";

export type OrderStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export class OrderCreatedEvent {
  constructor(
    readonly orderId: string,
    readonly userId: string,
    readonly amount: number,
  ) {}
}

export class Order extends AggregateRoot<string> {
  private constructor(
    readonly userId: string,
    readonly amount: number,
    readonly status: OrderStatus,
    id: string,
  ) {
    super(id);
  }

  static create(params: { userId: string; amount: number }): Order {
    if (params.amount <= 0) throw new DomainError("Order amount must be positive");
    const order = new Order(params.userId, params.amount, "PENDING", crypto.randomUUID());
    order.addEvent(new OrderCreatedEvent(order.id, order.userId, order.amount));
    return order;
  }

  static fromRow(row: { id: string; userId: string; amount: number; status: string }): Order {
    return new Order(row.userId, row.amount, row.status as OrderStatus, row.id);
  }
}

export const ORDER_REPOSITORY = Symbol("ORDER_REPOSITORY");

export interface OrderRepository {
  save(order: Order): Promise<void>;
  findById(id: string): Promise<Order | null>;
}
