/**
 * User 服务入口（HTTP :4300）
 *
 * 职责单一：提供 /users 端点 + 订阅 order.created —— 消费者。
 */

import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { UserServiceModule } from "./user.module.js";

async function bootstrap(): Promise<void> {
  const port = parseInt(process.env.USER_SERVICE_PORT ?? "4300", 10);
  const app = await NestFactory.create(UserServiceModule, { logger: ["log", "error", "warn"] });
  await app.listen(port);
  console.log(`[EDA User Service] HTTP listening on :${port}`);
}

bootstrap().catch((error) => {
  console.error("[EDA User Service] Failed to start:", error);
  process.exit(1);
});
