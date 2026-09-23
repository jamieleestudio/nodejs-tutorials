/**
 * 应用根模块 — 组装所有层
 *
 * DI 绑定（3 个 Token）：
 * - USER_REPOSITORY → PrismaUserRepository（在 PersistenceModule 中注册）
 * - USER_DOMAIN_SERVICE → UserDomainService（领域服务实现）
 * - USER_APPLICATION_SERVICE → UserApplicationService（应用服务实现）
 *
 * Controller 通过 @Inject(USER_APPLICATION_SERVICE) 注入接口，
 * 不依赖具体实现类。
 */

import { Module } from "@nestjs/common";
import { UserController } from "./interfaces/user/user.controller.js";
import { USER_APPLICATION_SERVICE } from "./application/user/user.application-service.port.js";
import { UserApplicationServiceImpl } from "./application/user/impl/user.application-service.impl.js";
import { USER_DOMAIN_SERVICE } from "./domain/user/user.domain-service.port.js";
import { UserDomainServiceImpl } from "./domain/user/impl/user.domain-service.impl.js";
import { PersistenceModule } from "./infrastructure/persistence/prisma/persistence.module.js";

@Module({
  imports: [PersistenceModule],
  controllers: [UserController],
  providers: [
    { provide: USER_DOMAIN_SERVICE, useClass: UserDomainServiceImpl },
    { provide: USER_APPLICATION_SERVICE, useClass: UserApplicationServiceImpl },
  ],
})
export class AppModule {}