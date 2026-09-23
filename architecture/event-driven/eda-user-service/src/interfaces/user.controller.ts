/** User HTTP Controller */
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

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body(new ValidationPipe({ whitelist: true })) body: CreateUserRequestDto) {
    const user = await this.userService.createUser(body);
    return { id: user.id, email: user.email, name: user.name };
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const user = await this.userService.getUser(id);
    if (!user) return { statusCode: 404, message: `User "${id}" not found` };
    return { id: user.id, email: user.email, name: user.name };
  }
}
