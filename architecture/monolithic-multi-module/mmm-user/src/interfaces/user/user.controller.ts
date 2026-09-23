/**
 * 用户控制器（Interface Adapter）
 *
 * 重构后变化：
 * - 注入 UserApplicationService 接口（通过 DI Token），而非直接注入实现类
 * - 方法调用传 Command/Query 参数对象，而非裸参数
 */

import { Controller, Post, Get, Body, Param, ValidationPipe, Inject } from "@nestjs/common";
import { USER_APPLICATION_SERVICE, UserApplicationService } from "../../application/user.application-service.port.js";
import { CreateUserCommand } from "../../application/commands/create-user.command.js";
import { GetUserQuery } from "../../application/queries/get-user.query.js";
import { GetAllUsersQuery } from "../../application/queries/get-all-users.query.js";
import { CreateUserRequestDto } from "./create-user.request.dto.js";

@Controller("users")
export class UserController {
  constructor(
    @Inject(USER_APPLICATION_SERVICE) private readonly userApplicationService: UserApplicationService,
  ) {}

  @Post()
  async create(@Body(new ValidationPipe({ whitelist: true })) body: CreateUserRequestDto) {
    return this.userApplicationService.createUserCommand(
      new CreateUserCommand(body.email, body.name),
    );
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.userApplicationService.getUserQuery(new GetUserQuery(id));
  }

  @Get()
  async findAll() {
    return this.userApplicationService.getAllUsersQuery(new GetAllUsersQuery());
  }
}