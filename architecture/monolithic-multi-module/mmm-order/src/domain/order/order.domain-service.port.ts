import { User, UserRepository } from "@mmm/user";
import { Order } from "./order.entity.js";
import { OrderRepository } from "./order.repository.port.js";

export const ORDER_DOMAIN_SERVICE = Symbol("ORDER_DOMAIN_SERVICE");

export interface OrderDomainService {
  validateUserForOrder(userId: string): Promise<User>;
  createOrder(userId: string, amount: number): Order;
}