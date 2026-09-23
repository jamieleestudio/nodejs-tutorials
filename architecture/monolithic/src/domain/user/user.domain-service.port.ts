/**
 * User 领域服务接口（Port）
 *
 * 定义领域服务的抽象契约。
 * 实现类在 impl/user.domain-service.impl.ts 中。
 *
 * DI Token: USER_DOMAIN_SERVICE
 * 用于 NestJS 依赖注入绑定接口到实现。
 */

import { User } from "./user.entity.js";

export const USER_DOMAIN_SERVICE = Symbol("USER_DOMAIN_SERVICE");

export interface UserDomainService {
  /** 检查邮箱是否可用（未被占用） */
  ensureEmailAvailable(email: string): Promise<void>;

  /** 创建用户实体（先验邮箱唯一，再创建实体，返回未持久化的 User） */
  createUser(email: string, name: string): Promise<User>;
}