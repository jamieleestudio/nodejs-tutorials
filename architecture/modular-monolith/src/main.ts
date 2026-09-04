/**
 * Modular Monolith 入口（Bootstrap）
 *
 * 演示流程：
 * 1. 启动 NestJS 应用（CQRS + EventBus）
 * 2. 创建用户（直接通过 Prisma，模拟已有用户）
 * 3. POST /orders → CommandBus → CreateOrderCommandHandler
 *    → 验证用户 → 创建订单 → 发布 OrderCreatedEvent
 *    → EventBus → OrderCreatedEventHandler 打印日志
 * 4. GET /orders/:id → QueryBus → GetOrderQueryHandler
 * 5. GET /orders/user/:userId → 查询用户所有订单
 * 6. 打印架构特征 + 事件流说明
 * 7. 关闭应用
 */

import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { PrismaClient } from "./generated/prisma/index.js";
import { AppModule } from "./app.module.js";

async function bootstrap(): Promise<void> {
  console.log("=== Modular Monolith Architecture (CQRS + EventBus + Order Domain) ===\n");

  // 预置：通过 Prisma 直接创建测试用户（模拟已有数据）
  const prisma = new PrismaClient();
  let testUser: { id: string; email: string; name: string };
  const existing = await prisma.user.findUnique({ where: { email: "bob@example.com" } });
  if (existing) {
    testUser = existing;
  } else {
    testUser = await prisma.user.create({
      data: { email: "bob@example.com", name: "Bob" },
    });
  }
  await prisma.$disconnect();

  // 创建 NestJS 应用
  const app = await NestFactory.create(AppModule, { logger: ["log", "error", "warn"] });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(0);
  const port = app.getHttpServer().address().port;
  console.log(`[Modular Monolith] HTTP server listening on port ${port}`);

  const baseUrl = `http://127.0.0.1:${port}`;

  // 演示 1：创建订单（触发 CQRS 命令 + 领域事件）
  console.log("\n--- Demo: Create Order (CQRS Command + EventBus) ---");
  console.log("(OrderCreatedEventHandler will log via EventBus)");
  const createRes = await fetch(`${baseUrl}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: testUser.id, amount: 99.50 }),
  });
  const created = await createRes.json() as { id: string; userId: string; amount: number; status: string };
  console.log(`POST /orders → ${createRes.status}`);
  console.log(`  Response: ${JSON.stringify(created)}`);

  // 演示 2：查询订单（CQRS 查询侧）
  console.log("\n--- Demo: Get Order by ID (CQRS Query) ---");
  const getRes = await fetch(`${baseUrl}/orders/${created.id}`);
  const fetched = await getRes.json() as { id: string; amount: number; status: string };
  console.log(`GET /orders/${created.id} → ${getRes.status}`);
  console.log(`  Response: ${JSON.stringify(fetched)}`);

  // 演示 3：按用户查询订单
  console.log("\n--- Demo: Get Orders by User ---");
  const userOrdersRes = await fetch(`${baseUrl}/orders/user/${testUser.id}`);
  const userOrders = await userOrdersRes.json() as Array<{ id: string; amount: number }>;
  console.log(`GET /orders/user/${testUser.id} → ${userOrdersRes.status}`);
  console.log(`  Response: ${JSON.stringify(userOrders)}`);

  // 架构特征
  console.log("\n=== Architecture Characteristics ===");
  console.log("Layer structure: domain → application → interfaces → infrastructure");
  console.log("Pattern:         CQRS (CommandBus + QueryBus + EventBus)");
  console.log("Module coupling: Order module emits events, User module handles them");
  console.log("  - OrderModule does NOT import UserModule");
  console.log("  - Communication via EventBus (publish/subscribe)");
  console.log("  - Future: each module can be extracted to a microservice");
  console.log("DI binding:       USER_REPOSITORY/ORDER_REPOSITORY → Prisma implementations");

  await app.close();
  console.log("\n[Modular Monolith] Application closed");
}

bootstrap().catch((error) => {
  console.error("Failed to start modular-monolith:", error);
  process.exit(1);
});