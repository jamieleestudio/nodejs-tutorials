/**
 * MasterAppModule — Master 节点模块
 *
 * 导入 @dist/task-core（TaskCoreModule 提供业务服务），
 * 提供 WorkerDispatcher 适配器（HTTP → Worker）与 WORKER_URLS 配置。
 */

import { Module } from "@nestjs/common";
import { TaskCoreModule, WORKER_DISPATCHER } from "@dist/task-core";
import { TaskController } from "./interfaces/task/task.controller.js";
import { WorkerClient } from "./infrastructure/worker-communication/worker-client.js";

@Module({
  imports: [TaskCoreModule],
  controllers: [TaskController],
  providers: [
    WorkerClient,
    { provide: WORKER_DISPATCHER, useExisting: WorkerClient },
    { provide: "WORKER_URLS", useValue: [] as string[] },
  ],
})
export class MasterAppModule {}
