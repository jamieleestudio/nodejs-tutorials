/**
 * 单体架构入口（Bootstrap）
 *
 * 启动流程：
 * 1. 创建 NestJS 应用
 * 2. 启用全局 ValidationPipe（自动校验请求体）
 * 3. 监听随机端口
 * 4. 演示 API 调用（创建用户 → 查询用户 → 查询所有用户）
 * 5. 打印架构特征说明
 * 6. 关闭应用
 *
 * 运行前确保 PostgreSQL 已启动：
 *   cd architecture && docker compose up -d
 *   npx prisma migrate dev --schema monolith/prisma/schema.prisma
 */

import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module.js";

async function bootstrap(): Promise<void> {
  console.log("=== Monolith Architecture (Non-CQRS + User Domain) ===\n");

  // 创建 NestJS 应用
  const app = await NestFactory.create(AppModule, { logger: ["error", "warn"] });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // 听随机端口
  await app.listen(0);
  const port = app.getHttpServer().address().port;
  console.log(`[Monolith] HTTP server listening on port ${port}`);

  // 演示 API 调用
  const baseUrl = `http://127.0.0.1:${port}`;

  console.log("\n--- Demo: Create User ---");
  const createRes = await fetch(`${baseUrl}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "alice@example.com", name: "Alice" }),
  });
  const created = await createRes.json() as { id: string; email: string; name: string };
  console.log(`POST /users → ${createRes.status}`);
  console.log(`  Response: ${JSON.stringify(created)}`);

  console.log("\n--- Demo: Get User by ID ---");
  const getRes = await fetch(`${baseUrl}/users/${created.id}`);
  const fetched = await getRes.json() as { id: string; email: string; name: string };
  console.log(`GET /users/${created.id} → ${getRes.status}`);
  console.log(`  Response: ${JSON.stringify(fetched)}`);

  console.log("\n--- Demo: Get All Users ---");
  const allRes = await fetch(`${baseUrl}/users`);
  const all = await allRes.json() as Array<{ id: string; email: string; name: string }>;
  console.log(`GET /users → ${allRes.status}`);
  console.log(`  Response: ${JSON.stringify(all)}`);

  // 打印架构特征
  console.log("\n=== Architecture Characteristics ===");
  console.log("Layer structure: domain → application → interfaces → infrastructure");
  console.log("  domain/         Pure TS entities, value objects, repository ports");
  console.log("  application/    Use cases (direct injection, non-CQRS)");
  console.log("  interfaces/     Controllers + HTTP request DTOs");
  console.log("  infrastructure/ Prisma + Repository implementations");
  console.log("Dependency rule: dependencies point inward only");
  console.log("DI binding:      USER_REPOSITORY token → PrismaUserRepository");
  console.log("Deployment:      Single process, single NestJS app");

  // 关闭应用
  await app.close();
  console.log("\n[Monolith] Application closed");
}

bootstrap().catch((error) => {
  console.error("Failed to start monolith:", error);
  process.exit(1);
});