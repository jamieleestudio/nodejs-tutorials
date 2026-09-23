/**
 * ERP 应用入口
 *
 * 演示：POST /erp/users → POST /erp/orders（触发领域事件）→ GET /erp/orders/:id
 * 全局异常过滤器演示：POST 一个非法 amount → DomainError → 400
 */

import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module.js";

async function bootstrap(): Promise<void> {
  console.log("=== ERP Architecture (COLA: shared-kernel / platform / module / app) ===\n");

  const app = await NestFactory.create(AppModule, { logger: ["log", "error", "warn"] });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = parseInt(process.env.PORT ?? "4600", 10);
  await app.listen(port);
  console.log(`[ERP App] HTTP listening on :${port}`);

  const baseUrl = `http://127.0.0.1:${port}`;

  // 演示 1：创建用户
  console.log("\n--- Demo: Create User (POST /erp/users) ---");
  const userRes = await fetch(`${baseUrl}/erp/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "erin@example.com", name: "Erin" }),
  });
  const user = await userRes.json() as { id: string; name: string };
  console.log(`POST /erp/users → ${userRes.status}`);
  console.log(`  Response: ${JSON.stringify(user)}`);

  // 演示 2：创建订单（EventBus 事件日志见上方 OrderCreatedEventHandler 输出）
  console.log("\n--- Demo: Create Order (POST /erp/orders) ---");
  const orderRes = await fetch(`${baseUrl}/erp/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: user.id, amount: 88.8 }),
  });
  const order = await orderRes.json() as { id: string; status: string };
  console.log(`POST /erp/orders → ${orderRes.status}`);
  console.log(`  Response: ${JSON.stringify(order)}`);

  // 演示 3：领域错误 → 统一 400
  console.log("\n--- Demo: DomainError → 400 (negative amount) ---");
  const badRes = await fetch(`${baseUrl}/erp/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: user.id, amount: -1 }),
  });
  const bad = await badRes.json() as { statusCode: number; message: string };
  console.log(`POST /erp/orders (amount=-1) → ${badRes.status}`);
  console.log(`  Response: ${JSON.stringify(bad)}`);

  console.log("\n=== Architecture Characteristics ===");
  console.log("Layers:      shared-kernel ← platform ← module ← app (strict, tested)");
  console.log("Platform:    reusable tech components (filter/interceptor/config)");
  console.log("Modules:     user + order business, CQRS EventBus in-process");
  console.log("App:         boot assembly only, zero business code");
  console.log("Guard tests: @erp/architecture-test enforces the dependency rules");
  console.log("Database:    ONE shared DB (arch_erp) for the whole app");

  await app.close();
  console.log("\n[ERP App] Application closed");
}

bootstrap().catch((error) => {
  console.error("Failed to start erp app:", error);
  process.exit(1);
});
