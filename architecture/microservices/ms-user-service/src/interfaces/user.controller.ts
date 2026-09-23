/**
 * User HTTP Controller — User 服务的 REST 入口
 *
 * TCP @MessagePattern 供服务间 RPC（Order 服务调用），
 * HTTP 供外部客户端 / API Gateway 调用。
 */

import { Controller, Post, Get, Body, Param, ValidationPipe, Inject } from "@nestjs/common";
import { IsEmail, IsString, MinLength, MaxLength } from "class-validator";
import { USER_APPLICATION_SERVICE, UserApplicationService } from "../application/user.application-service.port.js";
import { CreateUserCommand } from "../application/commands/create-user.command.js";
import { GetUserQuery } from "../application/queries/get-user.query.js";

class CreateUserRequestDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name!: string;
}

@Controller("users")
export class UserController {
  constructor(
    @Inject(USER_APPLICATION_SERVICE) private readonly userAppService: UserApplicationService,
  ) {}

  @Post()
  async create(@Body(new ValidationPipe({ whitelist: true })) body: CreateUserRequestDto) {
    return this.userAppService.createUserCommand(new CreateUserCommand(body.email, body.name));
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.userAppService.getUserQuery(new GetUserQuery(id));
  }
}
