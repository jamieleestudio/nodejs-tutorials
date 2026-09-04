/**
 * User 仓储接口（Port）
 *
 * 定义领域层对持久化的抽象需求，不包含任何实现细节。
 * infrastructure 层的 PrismaUserRepository 实现此接口。
 *
 * 通过依赖反转（DIP）：
 * - application 层依赖此接口（抽象）
 * - infrastructure 层实现此接口（具体）
 * - NestJS DI 在运行时绑定两者
 *
 * 注意：接口中的类型是领域实体 User，而非 Prisma 模型。
 * 映射由 Repository 实现内部的 Mapper 完成。
 */

import { User } from "./user.entity.js";

export const USER_REPOSITORY = Symbol("USER_REPOSITORY");

export interface UserRepository {
  /** 根据 ID 查找用户，不存在返回 null */
  findById(id: string): Promise<User | null>;

  /** 根据邮箱查找用户，不存在返回 null */
  findByEmail(email: string): Promise<User | null>;

  /** 保存用户（新增或更新） */
  save(user: User): Promise<void>;

  /** 删除用户 */
  delete(id: string): Promise<void>;

  /** 查询所有用户 */
  findAll(): Promise<User[]>;
}