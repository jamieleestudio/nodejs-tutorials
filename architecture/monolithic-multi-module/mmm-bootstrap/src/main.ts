/**
 * Monolithic Multi-Module 入口（Bootstrap）
 *
 * 与 java mmm-bootstrap 对应：多个上下文模块组装为 1 个可部署进程。
 *
 * 演示流程：
 * 1. 启动 NestJS 应用（装配 OrderModule + UserModule）
 * 2. POST /users → User 上下文创建用户
 * 3. POST /orders → Order 上下文：验证用户 → 创建订单 → 发布 OrderCreatedEvent
 *    → EventBus → UserModule 的 OrderCreatedEventHandler 打印日志
 * 4. GET /orders/:id、GET /orders/user/:userId
 * 5. 打印架构特征 + 模块依赖方向
 *
 * 运行前：
 *   docker compose up -d
 *   pnpm prisma:migrate（或 turbo run prisma:migrate）
 */

import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module.js";

interface UserDto {
  id: string;
  email: string;
  name: string;
}

async function bootstrap(): Promise<void> {
  console.log("=== Monolithic Multi-Module Architecture (CQRS + EventBus, module packages) ===\n");

  const app = await NestFactory.create(AppModule, { logger: ["log", "error", "warn"] });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(0);
  const port = app.getHttpServer().address().port;
  console.log(`[MMM Bootstrap] HTTP server listening on port ${port}`);

  const baseUrl = `http://127.0.0.1:${port}`;

  // 演示 1：通过 User 上下文创建用户
  console.log("\n--- Demo: Create User via UserModule (POST /users) ---");
  const userRes = await fetch(`${baseUrl}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "bob@example.com", name: "Bob" }),
  });
  const testUser = (await userRes.json()) as UserDto;
  console.log(`POST /users → ${userRes.status}`);
  console.log(`  Response: ${JSON.stringify(testUser)}`);

  // 演示 2：创建订单（CQRS 命令 + 领域事件）
  console.log("\n--- Demo: Create Order via OrderModule (POST /orders) ---");
  console.log("(OrderCreatedEventHandler will log via EventBus)");
  const createRes = await fetch(`${baseUrl}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: testUser.id, amount: 99.5 }),
  });
  const created = (await createRes.json()) as { id: string; userId: string; amount: number; status: string };
  console.log(`POST /orders → ${createRes.status}`);
  console.log(`  Response: ${JSON.stringify(created)}`);

  // 演示 3：查询订单（CQRS 查询侧）
  console.log("\n--- Demo: Get Order by ID ---");
  const getRes = await fetch(`${baseUrl}/orders/${created.id}`);
  const fetched = await getRes.json() as { id: string; amount: number; status: string };
  console.log(`GET /orders/${created.id} → ${getRes.status}`);
  console.log(`  Response: ${JSON.stringify(fetched)}`);

  // 演示 4：按用户查询订单
  console.log("\n--- Demo: Get Orders by User ---");
  const userOrdersRes = await fetch(`${baseUrl}/orders/user/${testUser.id}`);
  const userOrders = await userOrdersRes.json() as Array<{ id: string; amount: number }>;
  console.log(`GET /orders/user/${testUser.id} → ${userOrdersRes.status}`);
  console.log(`  Response: ${JSON.stringify(userOrders)}`);

  // 架构特征
  console.log("\n=== Architecture Characteristics ===");
  console.log("Deployment unit:  ONE process (like java fat jar)");
  console.log("Context boundary: pnpm workspace packages (compile-time enforced)");
  console.log("Module deps:      bootstrap → order → user → shared-kernel (acyclic)");
  console.log("Event contracts:  OrderCreatedEvent lives in @mmm/shared-kernel");
  console.log("Decoupling:       Order publishes, User subscribes via EventBus");
  console.log("Databases:        each context owns its DB (arch_mmm_user / arch_mmm_order)");

  await app.close();
  console.log("\n[MMM Bootstrap] Application closed");
}

bootstrap().catch((error) => {
  console.error("Failed to start monolithic-multi-module:", error);
  process.exit(1);
});
