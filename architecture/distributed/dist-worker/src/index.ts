/**
 * @dist/worker — Worker 进程包
 *
 * 运行入口通过 "@dist/worker/worker" 导出（由 @dist/master fork 启动）。
 */
export { WorkerAppModule, WorkerTaskController } from "./worker-app.module.js";
