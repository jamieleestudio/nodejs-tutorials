import { User } from "../user/user.entity.js";
import { Order } from "./order.entity.js";
import { OrderRepository } from "./order.repository.port.js";
import { UserRepository } from "../user/user.repository.port.js";

export const ORDER_DOMAIN_SERVICE = Symbol("ORDER_DOMAIN_SERVICE");

export interface OrderDomainService {
  validateUserForOrder(userId: string): Promise<User>;
  createOrder(userId: string, amount: number): Order;
}