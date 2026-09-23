/**
 * Order 服务入口（HTTP :4200）
 *
 * 职责单一：接收 POST /orders → 持久化 → 发布 order.created。
 * 不订阅任何事件、不调用任何服务 —— 生产者。
 */

import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { OrderServiceModule } from "./order.module.js";

async function bootstrap(): Promise<void> {
  const port = parseInt(process.env.ORDER_SERVICE_PORT ?? "4200", 10);
  const app = await NestFactory.create(OrderServiceModule, { logger: ["error", "warn"] });
  await app.listen(port);
  console.log(`[EDA Order Service] HTTP listening on :${port}`);
}

bootstrap().catch((error) => {
  console.error("[EDA Order Service] Failed to start:", error);
  process.exit(1);
});
