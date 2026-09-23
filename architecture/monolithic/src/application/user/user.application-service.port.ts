/**
 * UserApplicationService 接口（Port）
 *
 * 定义应用服务的抽象契约。
 * 命名约定借鉴 CQRS：
 * - 写操作方法名带 Command 后缀：createUserCommand(...)
 * - 读操作方法名带 Query 后缀：getUserQuery(...)
 *
 * DI Token: USER_APPLICATION_SERVICE
 */

import { CreateUserCommand } from "./commands/create-user.command.js";
import { GetUserQuery } from "./queries/get-user.query.js";
import { GetAllUsersQuery } from "./queries/get-all-users.query.js";
import { UserDto } from "./dto/user.dto.js";

export const USER_APPLICATION_SERVICE = Symbol("USER_APPLICATION_SERVICE");

export interface UserApplicationService {
  /** 创建用户（写操作） */
  createUserCommand(command: CreateUserCommand): Promise<UserDto>;

  /** 查询单个用户（读操作） */
  getUserQuery(query: GetUserQuery): Promise<UserDto>;

  /** 查询所有用户（读操作） */
  getAllUsersQuery(query: GetAllUsersQuery): Promise<UserDto[]>;
}