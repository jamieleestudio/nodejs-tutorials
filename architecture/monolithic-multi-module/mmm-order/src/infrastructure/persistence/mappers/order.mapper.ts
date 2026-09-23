/** Order Mapper — 领域实体 ↔ Prisma 模型 */
import { Order } from "../../../domain/order/order.entity.js";
import { OrderStatus, OrderStatusValue } from "../../../domain/order/order-status.value-object.js";

interface OrderPrismaModel {
  id: string; userId: string; amount: number; status: string;
  createdAt: Date; updatedAt: Date;
}

export class OrderMapper {
  static toDomain(m: OrderPrismaModel): Order {
    return Order.reconstitute({
      id: m.id, userId: m.userId, amount: m.amount,
      status: m.status as OrderStatusValue,
      createdAt: m.createdAt, updatedAt: m.updatedAt,
    });
  }

  static toPersistence(order: Order): OrderPrismaModel {
    return {
      id: order.id, userId: order.userId, amount: order.amount,
      status: order.status.value,
      createdAt: order.createdAt, updatedAt: order.updatedAt,
    };
  }
}