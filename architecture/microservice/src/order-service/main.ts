/**
 * Order 服务入口
 *
 * Order 服务是 HTTP + TCP 混合服务：
 * - 使用 NestFactory.create() 创建标准 HTTP 应用
 * - 同时通过 connectMicroservice() 挂载 TCP 传输层
 * - HTTP 供外部调用，TCP ClientProxy 供调用 User 微服务
 */

import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { OrderServiceModule } from "./order.module.js";

async function bootstrap(): Promise<void> {
  const port = parseInt(process.env.ORDER_SERVICE_PORT ?? "3000", 10);

  const app = await NestFactory.create(OrderServiceModule, { logger: ["log", "error", "warn"] });

  // 连接 TCP 微服务客户端
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { host: "127.0.0.1", port: parseInt(process.env.ORDER_TCP_PORT ?? "4002", 10) },
  });

  await app.startAllMicroservices();
  await app.listen(port);
  console.log(`[Order Service] HTTP listening on port ${port}`);

}

export { bootstrap };