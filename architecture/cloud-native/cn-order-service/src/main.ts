/**
 * Order 服务入口（云原生）
 */

import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { OrderModule } from "./order.module.js";

async function bootstrap(): Promise<void> {
  const port = parseInt(process.env.PORT ?? "4500", 10);
  const app = await NestFactory.create(OrderModule, { logger: ["error", "warn"] });
  app.enableShutdownHooks();
  await app.listen(port, "0.0.0.0");
  console.log(`[CN Order Service] listening on :${port} (0.0.0.0, container-ready)`);
}

bootstrap().catch((error) => {
  console.error("[CN Order Service] Failed to start:", error);
  process.exit(1);
});
