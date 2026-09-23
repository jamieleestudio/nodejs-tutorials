/**
 * User 服务入口（云原生 12-Factor 示范）
 *
 * - III. Config：端口/数据库全部来自环境变量
 * - VIII. Concurrency：无状态，可水平扩容（Scale to N）
 * - IX. Disposability：enableShutdownHooks + Prisma 优雅断开（SIGTERM）
 * - X. Dev/Prod parity：同一镜像跑在任何环境
 */

import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { UserModule } from "./user.module.js";

async function bootstrap(): Promise<void> {
  const port = parseInt(process.env.PORT ?? "4400", 10);
  const app = await NestFactory.create(UserModule, { logger: ["error", "warn"] });

  // IX. Disposability：SIGTERM 时先停止接单、再优雅关闭（Prisma onModuleDestroy）
  app.enableShutdownHooks();

  await app.listen(port, "0.0.0.0");
  console.log(`[CN User Service] listening on :${port} (0.0.0.0, container-ready)`);
}

bootstrap().catch((error) => {
  console.error("[CN User Service] Failed to start:", error);
  process.exit(1);
});
