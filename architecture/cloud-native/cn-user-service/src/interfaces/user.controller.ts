/** User HTTP Controller + 健康检查（云原生探针） */
import { Controller, Post, Get, Body, Param, ValidationPipe, Inject } from "@nestjs/common";
import { IsEmail, IsString, MinLength } from "class-validator";
import { UserService } from "../application/user.service.js";

class CreateUserRequestDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(1)
  name!: string;
}

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** Kubernetes liveness/readiness probe */
  @Get("healthz")
  health() {
    return { status: "ok", service: "cn-user-service", time: new Date().toISOString() };
  }

  @Post("users")
  async create(@Body(new ValidationPipe({ whitelist: true })) body: CreateUserRequestDto) {
    const user = await this.userService.createUser(body);
    return { id: user.id, email: user.email, name: user.name };
  }

  @Get("users/:id")
  async findOne(@Param("id") id: string) {
    const user = await this.userService.getUser(id);
    if (!user) return { statusCode: 404, message: `User "${id}" not found` };
    return { id: user.id, email: user.email, name: user.name };
  }
}
