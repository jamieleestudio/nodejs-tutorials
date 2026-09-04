/**
 * 微服务架构入口
 *
 * 启动流程：
 * 1. fork User 微服务子进程（TCP :4001）
 * 2. fork Order 服务子进程（HTTP :3000 + TCP ClientProxy）
 * 3. 等待两个服务就绪
 * 4. 通过 HTTP 调用 Order 服务：
 *    a. 先通过 Order 服务的 TCP 调 User 服务创建用户
 *    b. 再创建订单（Order 服务内部 TCP 验证用户）
 * 5. 打印架构特征
 * 6. 终止所有子进程
 *
 * 微服务架构特征：
 * - 每个服务独立进程、独立部署
 * - 通过 TCP 传输层 RPC 调用（非 HTTP）
 * - CQRS：CommandBus/QueryBus 分发
 * - 服务间通过 ClientProxy 通信
 */

import { fork, ChildProcess } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { PrismaClient } from "./generated/prisma/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function bootstrap(): Promise<void> {
  console.log("=== Microservice Architecture (CQRS + Cross-Service TCP) ===\n");

  // 预置：创建测试用户（直接通过 Prisma，模拟 User 服务已有数据）
  const prisma = new PrismaClient();
  let testUser: { id: string; name: string };
  const existing = await prisma.user.findFirst({ where: { email: "charlie@example.com" } });
  if (existing) {
    testUser = existing;
  } else {
    testUser = await prisma.user.create({ data: { email: "charlie@example.com", name: "Charlie" } });
  }
  await prisma.$disconnect();

  // --- 1. 启动 User 微服务（TCP :4001） ---
  console.log("[Microservice] Starting User Microservice (TCP :4001)...");
  const userScript = join(__dirname, "user-service", "main.ts");
  const userProcess = fork(userScript, [], {
    env: { ...process.env, USER_SERVICE_PORT: "4001" },
    execArgv: ["--import", "tsx"],
  });
  console.log(`  User Microservice PID: ${userProcess.pid}`);

  // --- 2. 启动 Order 服务（HTTP :3000） ---
  console.log("[Microservice] Starting Order Service (HTTP :3000, TCP client)...");
  const orderScript = join(__dirname, "order-service", "main.ts");
  const orderProcess = fork(orderScript, [], {
    env: {
      ...process.env,
      ORDER_SERVICE_PORT: "3000",
      ORDER_TCP_PORT: "4002",
      USER_SERVICE_PORT: "4001",
    },
    execArgv: ["--import", "tsx"],
  });
  console.log(`  Order Service PID: ${orderProcess.pid}`);

  // 等待服务启动
  console.log("\n[Microservice] Waiting for services to start...");
  await sleep(4000);

  // --- 3. 演示：通过 Order 服务创建订单 ---
  console.log("\n--- Demo: Create Order via Order Service HTTP ---");
  console.log("(Order Service will TCP-call User Service to validate user)");
  try {
    const createRes = await fetch("http://127.0.0.1:3000/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: testUser.id, amount: 150.00 }),
    });
    const created = await createRes.json() as { id: string; userId: string; amount: number; status: string };
    console.log(`POST /orders → ${createRes.status}`);
    console.log(`  Response: ${JSON.stringify(created)}`);

    // 查询订单
    console.log("\n--- Demo: Get Order by ID ---");
    const getRes = await fetch(`http://127.0.0.1:3000/orders/${created.id}`);
    const fetched = await getRes.json() as { id: string; amount: number; status: string };
    console.log(`GET /orders/${created.id} → ${getRes.status}`);
    console.log(`  Response: ${JSON.stringify(fetched)}`);
  } catch (error) {
    console.log(`  Error: ${(error as Error).message}`);
  }

  // --- 4. 架构特征 ---
  console.log("\n=== Architecture Characteristics ===");
  console.log("Layer structure: domain → application → interfaces → infrastructure");
  console.log("Pattern:         CQRS (CommandBus + QueryBus)");
  console.log("Deployment:      2 independent processes");
  console.log("  - User Service:  TCP :4001 (microservice, no HTTP)");
  console.log("  - Order Service: HTTP :3000 + TCP client to User Service");
  console.log("Communication:   Order → User via TCP ClientProxy (RPC)");
  console.log("  - ClientProxy sends { cmd: 'get_user' } pattern");
  console.log("  - User Service matches via @MessagePattern");
  console.log("Difference from modular-monolith:");
  console.log("  - modular-monolith: EventBus (fire-and-forget, same process)");
  console.log("  - microservice:     ClientProxy RPC (request-response, cross process)");

  // --- 5. 清理 ---
  console.log("\n[Microservice] Terminating services...");
  userProcess.kill();
  orderProcess.kill();
  console.log("[Microservice] All services terminated");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

bootstrap().catch((error) => {
  console.error("Failed to start microservice:", error);
  process.exit(1);
});