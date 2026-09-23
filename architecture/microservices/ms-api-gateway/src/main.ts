/**
 * API Gateway 入口
 */

import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { GatewayModule } from "./gateway.module.js";

async function bootstrap(): Promise<void> {
  const port = parseInt(process.env.GATEWAY_PORT ?? "8080", 10);
  const app = await NestFactory.create(GatewayModule, { logger: ["error", "warn"] });
  app.enableCors();
  await app.listen(port);
  console.log(`[API Gateway] listening on :${port}`);
}

bootstrap().catch((error) => {
  console.error("[API Gateway] Failed to start:", error);
  process.exit(1);
});
