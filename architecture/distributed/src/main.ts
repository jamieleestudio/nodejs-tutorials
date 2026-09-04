/**
 * 分布式架构入口
 *
 * 启动流程：
 * 1. fork 3 个 Worker 子进程，各自监听不同端口
 * 2. 启动 Master NestJS 应用，注入 Worker URL 列表
 * 3. POST /tasks/compute → Master 分发到 3 个 Worker → 并行处理 → 汇总
 * 4. 打印架构特征
 * 5. 关闭 Master，终止所有 Worker 子进程
 *
 * 分布式架构特征：
 * - 多进程：Master 和 Worker 是独立进程
 * - 网络通信：通过 HTTP 互调
 * - 并行处理：任务分发给多个 Worker 同时执行
 * - 容错：单个 Worker 故障不影响整体（有错误捕获）
 */

import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { fork, ChildProcess } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { MasterAppModule } from "./master-app.module.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const WORKER_COUNT = 3;
const WORKER_BASE_PORT = 9101;

async function bootstrap(): Promise<void> {
  console.log("=== Distributed Architecture (Non-CQRS + Task Domain + Multi-Process) ===\n");

  // --- 1. 启动 Worker 子进程 ---
  console.log(`[Distributed] Starting ${WORKER_COUNT} worker processes...`);
  const workers: ChildProcess[] = [];
  const workerUrls: string[] = [];
  const workerScript = join(__dirname, "worker.ts");

  for (let i = 0; i < WORKER_COUNT; i++) {
    const port = WORKER_BASE_PORT + i;
    const worker = fork(workerScript, [], {
      env: { ...process.env, WORKER_PORT: String(port) },
      execArgv: ["--import", "tsx"],
    });
    workers.push(worker);
    workerUrls.push(`http://127.0.0.1:${port}`);
    console.log(`  Worker ${i + 1} started (PID: ${worker.pid}, port: ${port})`);
  }

  // 等待 Worker 启动
  await sleep(2000);

  // --- 2. 启动 Master ---
  // 通过动态模块注入 workerUrls
  const module = await import("./master-app.module.js");
  const masterModule = {
    module: module.MasterAppModule,
    providers: [
      { provide: "WORKER_URLS", useValue: workerUrls },
    ],
  };

  const app = await NestFactory.create(masterModule, { logger: ["error", "warn"] });
  await app.listen(0);
  const masterPort = app.getHttpServer().address().port;
  console.log(`\n[Distributed] Master HTTP server listening on port ${masterPort}`);

  // --- 3. 演示：分发计算任务 ---
  console.log("\n--- Demo: Dispatch Task to 3 Workers ---");
  const baseUrl = `http://127.0.0.1:${masterPort}`;
  const computeRes = await fetch(`${baseUrl}/tasks/compute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payload: "Hello-Distributed-World" }),
  });
  const result = await computeRes.json() as {
    task: { id: string; payload: string; status: string };
    workerResults: Array<{ workerUrl: string; result: string; status: string }>;
  };
  console.log(`POST /tasks/compute → ${computeRes.status}`);
  console.log(`  Task ID: ${result.task.id}`);
  console.log(`  Task status: ${result.task.status}`);
  console.log(`  Worker results:`);
  for (const wr of result.workerResults) {
    console.log(`    [${wr.workerUrl}] → result: "${wr.result}" (${wr.status})`);
  }

  // --- 4. 架构特征 ---
  console.log("\n=== Architecture Characteristics ===");
  console.log("Layer structure: domain → application → interfaces → infrastructure");
  console.log("Deployment:      Master process + N worker processes (fork)");
  console.log("Communication:   Master → Worker via HTTP (fetch)");
  console.log("Parallelism:     Promise.all dispatches to all workers concurrently");
  console.log("Fault tolerance: Worker errors caught, returned as FAILED status");
  console.log("Scalability:     Add more worker processes to increase throughput");

  // --- 5. 清理 ---
  await app.close();
  for (const worker of workers) {
    worker.kill();
  }
  console.log("\n[Distributed] Master closed, all workers terminated");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

bootstrap().catch((error) => {
  console.error("Failed to start distributed:", error);
  process.exit(1);
});