/**
 * User 微服务 RPC 控制器
 *
 * 使用 @MessagePattern 装饰器定义 TCP 消息处理端点。
 * 与 HTTP Controller 的区别：
 * - 不用 @Controller() 而用微服务特定的消息模式匹配
 * - 接收的不是 HTTP 请求而是 TCP 消息（pattern + payload）
 * - 返回值通过 TCP 传回调用方
 */

import { Controller, Inject } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { USER_APPLICATION_SERVICE, UserApplicationService } from "./application/user.application-service.port.js";
import { CreateUserCommand } from "./application/commands/create-user.command.js";
import { GetUserQuery } from "./application/queries/get-user.query.js";

@Controller()
export class UserRpcController {
  constructor(
    @Inject(USER_APPLICATION_SERVICE) private readonly userAppService: UserApplicationService,
  ) {}

  /** 创建用户 — pattern: { cmd: 'create_user' } */
  @MessagePattern({ cmd: "create_user" })
  async createUser(@Payload() data: { email: string; name: string }) {
    return this.userAppService.createUserCommand(new CreateUserCommand(data.email, data.name));
  }

  /** 查询用户 — pattern: { cmd: 'get_user' } */
  @MessagePattern({ cmd: "get_user" })
  async getUser(@Payload() data: { id: string }) {
    return this.userAppService.getUserQuery(new GetUserQuery(data.id));
  }
}