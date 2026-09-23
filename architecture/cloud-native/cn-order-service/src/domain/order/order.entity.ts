/** Order 实体 + 仓储端口 */
import { Entity } from "@cn/shared-kernel";

export type OrderStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export class Order extends Entity<string> {
  private constructor(
    readonly userId: string,
    readonly amount: number,
    readonly status: OrderStatus,
    id: string,
  ) {
    super(id);
  }

  static create(params: { userId: string; amount: number }): Order {
    if (params.amount <= 0) throw new Error("Amount must be positive");
    return new Order(params.userId, params.amount, "PENDING", crypto.randomUUID());
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
