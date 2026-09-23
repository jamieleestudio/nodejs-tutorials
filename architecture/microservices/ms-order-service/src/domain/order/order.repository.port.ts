/** Order 仓储接口 */
import { Order } from "./order.entity.js";
export const ORDER_REPOSITORY = Symbol("ORDER_REPOSITORY");
export interface OrderRepository {
  findById(id: string): Promise<Order | null>;
  save(order: Order): Promise<void>;
}