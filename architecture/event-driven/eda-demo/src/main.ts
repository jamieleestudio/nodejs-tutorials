/**
 * 事件驱动架构演示入口
 *
 * 前置：docker compose up -d（需要 postgres + redis）
 *
 * 启动流程：
 * 1. fork Order 服务（HTTP :4200，发布方）+ User 服务（HTTP :4300，订阅方）
 * 2. POST /users 创建用户
 * 3. POST /orders → 订单落库 → Redis 发布 order.created
 * 4. 等待事件传播 → User 服务日志打印"收到事件"
 * 5. 打印架构特征
 * 6. 终止子进程
 */

import { fork, ChildProcess } from "node:child_process";
import { createRequire } from "node:module";
import { sleep } from "./sleep.js";

const require = createRequire(import.meta.url);

async function bootstrap(): Promise<void> {
  console.log("=== Event-Driven Architecture (Redis pub/sub + Producer/Consumer) ===\n");

  // --- 1. 启动两个服务 ---
  console.log("[EDA] Starting services...");
  const procs: ChildProcess[] = [];
  const services: Array<[string, string, NodeJS.ProcessEnv]> = [
    ["Order Service (producer)", require.resolve("@eda/order-service/main"), { ORDER_SERVICE_PORT: "4200" }],
    ["User Service (consumer)", require.resolve("@eda/user-service/main"), { USER_SERVICE_PORT: "4300" }],
  ];
  for (const [name, script, env] of services) {
    const child = fork(script, [], { env: { ...process.env, ...env }, execArgv: ["--import", "tsx"] });
    procs.push(child);
    console.log(`  ${name} started (PID: ${child.pid})`);
  }

  await sleep(4000);

  // --- 2. 演示 ---
  console.log("\n--- Demo 1: Create User (POST /users) ---");
  const userRes = await fetch("http://127.0.0.1:4300/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "dave@example.com", name: "Dave" }),
  });
  const user = await userRes.json() as { id: string; name: string };
  console.log(`POST /users → ${userRes.status}`);
  console.log(`  Response: ${JSON.stringify(user)}`);

  console.log("\n--- Demo 2: Create Order (POST /orders → publishes order.created) ---");
  const orderRes = await fetch("http://127.0.0.1:4200/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: user.id, amount: 66.0 }),
  });
  const order = await orderRes.json() as { id: string; amount: number; status: string };
  console.log(`POST /orders → ${orderRes.status}`);
  console.log(`  Response: ${JSON.stringify(order)}`);

  console.log("\n[EDA] Waiting for event propagation...");
  await sleep(2000);
  console.log("(Check the log above: User Service should have logged 📬 order.created)");

  // --- 3. 架构特征 ---
  console.log("\n=== Architecture Characteristics ===");
  console.log("Workspace pkgs:  eda-shared-kernel / eda-event-bus / eda-order-service / eda-user-service");
  console.log("Coupling:        services share ONLY event contracts (topic + payload), no imports of each other");
  console.log("Broker:          Redis pub/sub (stand-in for RabbitMQ/Kafka)");
  console.log("Producer:        Order service persists then publishes order.created (fire-and-forget)");
  console.log("Consumer:        User service subscribes, reacts asynchronously");
  console.log("Failure isolation: producer does not fail if consumer is down (at-most-once demo)");
  console.log("Difference from ms:  ms = request-response RPC; eda = async events, temporal decoupling");

  // --- 4. 清理 ---
  console.log("\n[EDA] Terminating services...");
  for (const p of procs) p.kill();
  console.log("[EDA] All services terminated");
}

bootstrap().catch((error) => {
  console.error("Failed to start event-driven demo:", error);
  process.exit(1);
});
