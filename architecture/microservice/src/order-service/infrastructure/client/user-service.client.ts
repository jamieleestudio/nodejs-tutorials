/**
 * UserServiceClient — 通过 TCP ClientProxy 调用 User 微服务
 *
 * 微服务架构的核心通信组件：
 * - 使用 @nestjs/microservices 的 ClientProxy 发送 TCP 消息
 * - 发送 pattern: { cmd: 'get_user' } 到 User 微服务
 * - User 微服务通过 @MessagePattern 匹配并处理
 *
 * 这是跨服务 RPC 调用，与 modular-monolith 的 EventBus 解耦不同：
 * - EventBus：发布事件，不等待响应（fire-and-forget）
 * - ClientProxy：发送请求，等待响应（RPC）
 */

import { Injectable, Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { UserLookupPort } from "../../domain/order/order-lookup.port.js";

export interface UserRemoteDto {
  id: string;
  email: string;
  name: string;
}

@Injectable()
export class UserServiceClient implements UserLookupPort {
  constructor(
    @Inject("USER_SERVICE_CLIENT") private readonly client: ClientProxy,
  ) {}

  /** 调用 User 微服务查询用户 */
  async getUser(id: string): Promise<UserRemoteDto | null> {
    try {
      const result = await this.client.send({ cmd: "get_user" }, { id }).toPromise();
      return result as UserRemoteDto;
    } catch {
      return null;
    }
  }

  /** UserLookupPort 实现 */
  async getUserById(id: string): Promise<UserRemoteDto | null> {
    return this.getUser(id);
  }

  /** 调用 User 微服务创建用户 */
  async createUser(email: string, name: string): Promise<UserRemoteDto> {
    const result = await this.client.send({ cmd: "create_user" }, { email, name }).toPromise();
    return result as UserRemoteDto;
  }
}