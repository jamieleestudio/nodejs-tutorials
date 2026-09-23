/**
 * @cn/order-service — 公共 API
 */

export { OrderModule } from "./order.module.js";
export { OrderService } from "./application/order.service.js";
export { Order, ORDER_REPOSITORY, OrderRepository } from "./domain/order/order.entity.js";
export { USER_LOOKUP_PORT, UserLookupPort } from "./domain/order/user-lookup.port.js";
