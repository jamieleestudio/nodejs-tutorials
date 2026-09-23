/**
 * 微服务架构演示入口
 *
 * 启动流程：
 * 1. fork User 微服务（HTTP :4101 + TCP :4001，独立数据库 arch_ms_user）
 * 2. fork Order 服务（HTTP :3000 + TCP 客户端，独立数据库 arch_ms_order）
 * 3. fork API Gateway（HTTP :8080，唯一对外入口）
 * 4. 通过网关：POST /users → POST /orders（Order 内部 TCP RPC 验证用户）→ GET /orders/:id
 * 5. 打印架构特征
 * 6. 终止所有子进程
 *
 * 微服务架构特征（对齐 java ms-*）：
 * - 每个服务独立进程、独立数据库
 * - 服务间 TCP 传输层 RPC（@MessagePattern / ClientProxy）
 * - API Gateway 统一对外
 */

import { fork, ChildProcess } from "node:child_process";
import { createRequire } from "node:module";
import { sleep } from "./sleep.js";

const require = createRequire(import.meta.url);

async function bootstrap(): Promise<void> {
  console.log("=== Microservice Architecture (CQRS + Cross-Service TCP + API Gateway) ===\n");

  // --- 1. 启动 3 个独立服务 ---
  console.log("[Microservices] Starting services...");
  const procs: ChildProcess[] = [];
  const services: Array<[string, string, NodeJS.ProcessEnv]> = [
    ["User Service", require.resolve("@ms/user-service/main"), { USER_SERVICE_PORT: "4001", USER_HTTP_PORT: "4101" }],
    ["Order Service", require.resolve("@ms/order-service/main"), { ORDER_SERVICE_PORT: "3000", ORDER_TCP_PORT: "4002", USER_SERVICE_PORT: "4001" }],
    ["API Gateway", require.resolve("@ms/api-gateway/main"), { GATEWAY_PORT: "8080", USER_SERVICE_URL: "http://127.0.0.1:4101", ORDER_SERVICE_URL: "http://127.0.0.1:3000" }],
  ];
  for (const [name, script, env] of services) {
    const child = fork(script, [], { env: { ...process.env, ...env }, execArgv: ["--import", "tsx"] });
    procs.push(child);
    console.log(`  ${name} started (PID: ${child.pid})`);
  }

  console.log("\n[Microservices] Waiting for services to start...");
  await sleep(4000);

  const gateway = "http://127.0.0.1:8080";

  // --- 2. 演示：通过网关走完整流程 ---
  console.log("\n--- Demo 1: Create User via Gateway (POST /users) ---");
  const userRes = await fetch(`${gateway}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "charlie@example.com", name: "Charlie" }),
  });
  const user = await userRes.json() as { id: string; email: string; name: string };
  console.log(`POST /users → ${userRes.status}`);
  console.log(`  Response: ${JSON.stringify(user)}`);

  console.log("\n--- Demo 2: Create Order via Gateway (Order TCP-calls User to validate) ---");
  const orderRes = await fetch(`${gateway}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: user.id, amount: 150.0 }),
  });
  const order = await orderRes.json() as { id: string; userId: string; amount: number; status: string };
  console.log(`POST /orders → ${orderRes.status}`);
  console.log(`  Response: ${JSON.stringify(order)}`);

  console.log("\n--- Demo 3: Get Order via Gateway ---");
  const getRes = await fetch(`${gateway}/orders/${order.id}`);
  const fetched = await getRes.json() as { id: string; amount: number; status: string };
  console.log(`GET /orders/${order.id} → ${getRes.status}`);
  console.log(`  Response: ${JSON.stringify(fetched)}`);

  // --- 3. 架构特征 ---
  console.log("\n=== Architecture Characteristics ===");
  console.log("Workspace pkgs:  ms-shared-kernel / ms-user-service / ms-order-service / ms-api-gateway");
  console.log("Deployment:      3 independent processes + 2 independent databases");
  console.log("Communication:   External → Gateway (HTTP); Order → User (TCP RPC)");
  console.log("  - ClientProxy sends { cmd: 'get_user' } pattern");
  console.log("  - User Service matches via @MessagePattern");
  console.log("Data ownership:  each service has its own Prisma schema + database");
  console.log("Difference from mmm:");
  console.log("  - mmm:  EventBus (in-process, fire-and-forget), 1 deployable");
  console.log("  - ms:   ClientProxy RPC (cross-process, request-response), N deployables");

  // --- 4. 清理 ---
  console.log("\n[Microservices] Terminating services...");
  for (const p of procs) p.kill();
  console.log("[Microservices] All services terminated");
}

bootstrap().catch((error) => {
  console.error("Failed to start microservices demo:", error);
  for (const p of (globalThis as { __procs?: ChildProcess[] }).__procs ?? []) p.kill();
  process.exit(1);
});
