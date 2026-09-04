/**
 * PrismaService — PrismaClient 封装
 *
 * infrastructure 层专用，封装数据库连接。
 * 使用 @Injectable() 注册到 NestJS DI 容器。
 * 继承 PrismaClient 以便直接调用 prisma.user.create() 等方法。
 */

import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "../../../generated/prisma/index.js";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}