/**
 * User 微服务入口（HTTP + TCP 混合服务）
 *
 * - HTTP  :4101 供外部客户端 / API Gateway 调用
 * - TCP   :4001 供服务间 RPC（Order 服务通过 ClientProxy 调用）
 *
 * 独立部署：pnpm --filter @ms/user-service start
 */

import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { UserModule } from "./user.module.js";

async function bootstrap(): Promise<void> {
  const tcpPort = parseInt(process.env.USER_SERVICE_PORT ?? "4001", 10);
  const httpPort = parseInt(process.env.USER_HTTP_PORT ?? "4101", 10);

  const app = await NestFactory.create(UserModule, { logger: ["error", "warn"] });

  // 挂载 TCP 传输层（服务间 RPC）
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { host: "127.0.0.1", port: tcpPort },
  });

  await app.startAllMicroservices();
  await app.listen(httpPort);
  console.log(`[User Service] HTTP listening on :${httpPort}, TCP listening on :${tcpPort}`);
}

bootstrap().catch((error) => {
  console.error("[User Service] Failed to start:", error);
  process.exit(1);
});
