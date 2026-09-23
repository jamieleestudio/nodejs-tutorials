/**
 * 持久化模块 — 注册 Prisma 和 Repository 实现
 *
 * 关键：通过 NestJS DI 绑定接口 token 到具体实现（依赖反转）
 * - provide: USER_REPOSITORY（Symbol token，定义在 domain 层）
 * - useClass: PrismaUserRepository（实现，定义在 infrastructure 层）
 *
 * 这样 application 层注入 @Inject(USER_REPOSITORY) 时，
 * NestJS 会自动解析为 PrismaUserRepository 实例，
 * 但 application 层的代码只依赖接口，不依赖实现。
 */

import { Module } from "@nestjs/common";
import { USER_REPOSITORY } from "../../../domain/user/user.repository.port.js";
import { PrismaService } from "./prisma.service.js";
import { PrismaUserRepository } from "./user.repository.impl.js";

@Module({
  providers: [
    PrismaService,
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class PersistenceModule {}