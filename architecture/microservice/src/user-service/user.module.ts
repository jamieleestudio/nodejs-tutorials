/**
 * UserMicroserviceModule — 用户微服务模块
 *
 * 注册：
 * - UserRpcController（@MessagePattern 端点）
 * - Repository 实现（DI 绑定）
 * - UserDomainService / UserApplicationService（通过 token 绑定）
 */

import { Module } from "@nestjs/common";
import { USER_REPOSITORY } from "./domain/user/user.repository.port.js";
import { USER_DOMAIN_SERVICE } from "./domain/user/user.domain-service.port.js";
import { USER_APPLICATION_SERVICE } from "./application/user.application-service.port.js";
import { PrismaService } from "./infrastructure/persistence/prisma.service.js";
import { PrismaUserRepository } from "./infrastructure/persistence/user.repository.impl.js";
import { UserDomainServiceImpl } from "./domain/user/impl/user.domain-service.impl.js";
import { UserApplicationServiceImpl } from "./application/impl/user.application-service.impl.js";
import { UserRpcController } from "./user.rpc.controller.js";

@Module({
  controllers: [UserRpcController],
  providers: [
    PrismaService,
    { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
    { provide: USER_DOMAIN_SERVICE, useClass: UserDomainServiceImpl },
    { provide: USER_APPLICATION_SERVICE, useClass: UserApplicationServiceImpl },
  ],
})
export class UserMicroserviceModule {}