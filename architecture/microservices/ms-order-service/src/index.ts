/**
 * @ms/order-service — 订单微服务公共 API
 */

export { OrderServiceModule } from "./order.module.js";
export { ORDER_APPLICATION_SERVICE, OrderApplicationService } from "./application/order.application-service.port.js";
export type { OrderDto } from "./application/dto/order.dto.js";
