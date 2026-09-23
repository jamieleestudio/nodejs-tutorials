/**
 * Order 实体 + 仓储端口（简化版分层：单文件演示）
 */

export type OrderStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export class Order {
  private constructor(
    readonly id: string,
    readonly userId: string,
    readonly amount: number,
    readonly status: OrderStatus,
  ) {}

  static create(params: { userId: string; amount: number }): Order {
    if (params.amount <= 0) throw new Error("Amount must be positive");
    return new Order(crypto.randomUUID(), params.userId, params.amount, "PENDING");
  }

  static fromRow(row: { id: string; userId: string; amount: number; status: string }): Order {
    return new Order(row.id, row.userId, row.amount, row.status as OrderStatus);
  }
}

export const ORDER_REPOSITORY = Symbol("ORDER_REPOSITORY");

export interface OrderRepository {
  save(order: Order): Promise<void>;
  findById(id: string): Promise<Order | null>;
}
