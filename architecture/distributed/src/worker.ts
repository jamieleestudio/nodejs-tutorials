/**
 * Worker 进程入口
 *
 * 每个 Worker 是独立的 NestJS HTTP 服务进程：
 * - 监听 WORKER_PORT 环境变量指定的端口
 * - 接收 Master 发来的 POST /tasks/execute 请求
 * - 执行任务计算并返回结果
 *
 * 与 Master 的区别：
 * - 独立进程（通过 child_process.fork 启动）
 * - 只暴露 execute 端点，不暴露 compute
 * - 各自监听不同端口
 */

import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { WorkerAppModule } from "./worker-app.module.js";

async function bootstrap(): Promise<void> {
  const port = parseInt(process.env.WORKER_PORT ?? "9101", 10);

  const app = await NestFactory.create(WorkerAppModule, { logger: ["error", "warn"] });
  await app.listen(port);

  console.log(`[Worker] Listening on port ${port} (PID: ${process.pid})`);
}

bootstrap().catch((error) => {
  console.error(`[Worker] Failed to start on port ${process.env.WORKER_PORT}:`, error);
  process.exit(1);
});