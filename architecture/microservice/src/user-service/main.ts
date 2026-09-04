/**
 * User 微服务入口
 *
 * 使用 NestFactory.createMicroservice 创建 TCP 微服务：
 * - 不启动 HTTP 服务器
 * - 通过 TCP 传输层接收消息
 * - @MessagePattern 匹配消息模式
 *
 * OrderService 通过 ClientProxy 向此服务发送 TCP 消息。
 */

import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { UserMicroserviceModule } from "./user.module.js";

async function bootstrap(): Promise<void> {
  const port = parseInt(process.env.USER_SERVICE_PORT ?? "4001", 10);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserMicroserviceModule,
    {
      transport: Transport.TCP,
      options: { host: "127.0.0.1", port },
    },
  );

  await app.listen();
  console.log(`[User Microservice] TCP listening on port ${port}`);
}

export { bootstrap };