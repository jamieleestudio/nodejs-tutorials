import { CreateOrderCommand } from "./commands/create-order.command.js";
import { GetOrderQuery } from "./queries/get-order.query.js";
import { GetOrdersByUserQuery } from "./queries/get-orders-by-user.query.js";
import { OrderDto } from "./dto/order.dto.js";

export const ORDER_APPLICATION_SERVICE = Symbol("ORDER_APPLICATION_SERVICE");

export interface OrderApplicationService {
  createOrderCommand(command: CreateOrderCommand): Promise<OrderDto>;
  getOrderQuery(query: GetOrderQuery): Promise<OrderDto>;
  getOrdersByUserQuery(query: GetOrdersByUserQuery): Promise<OrderDto[]>;
}