/** Order 仓储接口（Port） */
import { Order } from "./order.entity.js";

export const ORDER_REPOSITORY = Symbol("ORDER_REPOSITORY");

export interface OrderRepository {
  findById(id: string): Promise<Order | null>;
  save(order: Order): Promise<void>;
  findByUserId(userId: string): Promise<Order[]>;
  findAll(): Promise<Order[]>;
}