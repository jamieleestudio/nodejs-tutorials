/**
 * UserServiceModule — 用户服务装配
 */

import { Module } from "@nestjs/common";
import { EventBusModule } from "@eda/event-bus";
import { USER_REPOSITORY } from "./domain/user/user.entity.js";
import { UserService } from "./application/user.service.js";
import { PrismaService } from "./infrastructure/persistence/prisma.service.js";
import { PrismaUserRepository } from "./infrastructure/persistence/user.repository.impl.js";
import { UserController } from "./interfaces/user.controller.js";

@Module({
  imports: [EventBusModule.forRoot()],
  controllers: [UserController],
  providers: [
    PrismaService,
    { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
    UserService,
  ],
})
export class UserServiceModule {}
