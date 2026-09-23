/** ErpUserModule — 用户模块装配 */
import { Module } from "@nestjs/common";
import { USER_REPOSITORY } from "./domain/user.entity.js";
import { UserService } from "./application/user.service.js";
import { PrismaService } from "./infrastructure/prisma.service.js";
import { PrismaUserRepository } from "./infrastructure/user.repository.impl.js";
import { UserController } from "./interfaces/user.controller.js";

@Module({
  controllers: [UserController],
  providers: [
    PrismaService,
    { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
    UserService,
  ],
  exports: [PrismaService, USER_REPOSITORY],
})
export class ErpUserModule {}
