/**
 * User 领域实体
 *
 * 封装用户的核心业务规则：
 * - email 通过 Email 值对象保证格式合法
 * - name 不能为空且不超过 100 字符
 * - 实体的状态变更通过方法调用（而非直接赋值属性），确保不变式始终成立
 *
 * 注意：此实体是纯 TypeScript 类，不依赖任何 NestJS / Prisma 装饰器。
 * 持久化映射由 infrastructure 层的 Mapper 负责。
 */

import { Entity } from "../shared/entity.base.js";
import { Email } from "./email.value-object.js";

export class User extends Entity<string> {
  private _email: Email;
  private _name: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(id: string, email: Email, name: string, createdAt: Date, updatedAt: Date) {
    super(id);
    this._email = email;
    this._name = name;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  /**
   * 工厂方法：创建新用户
   * 通过工厂方法而构造函数创建，可以在创建时生成 ID 和时间戳
   */
  static create(params: { id?: string; email: string; name: string }): User {
    const now = new Date();
    return new User(
      params.id ?? crypto.randomUUID(),
      new Email(params.email),
      User.validateName(params.name),
      now,
      now,
    );
  }

  /**
   * 从持久化层重建实体
   * 与 create 不同：使用已有的 ID 和时间戳，不生成新的
   */
  static reconstitute(params: {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(
      params.id,
      new Email(params.email),
      params.name,
      params.createdAt,
      params.updatedAt,
    );
  }

  get email(): Email {
    return this._email;
  }

  get name(): string {
    return this._name;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * 更新用户名 — 通过方法修改状态，确保不变式
   */
  rename(newName: string): void {
    this._name = User.validateName(newName);
    this._updatedAt = new Date();
  }

  /**
   * 更新邮箱 — 旧邮箱变更后返回新值对象
   */
  changeEmail(newEmail: string): void {
    this._email = new Email(newEmail);
    this._updatedAt = new Date();
  }

  /**
   * 业务不变式：用户名不能为空，不超过 100 字符
   */
  private static validateName(name: string): string {
    const trimmed = name.trim();
    if (trimmed.length === 0) {
      throw new Error("User name cannot be empty");
    }
    if (trimmed.length > 100) {
      throw new Error("User name cannot exceed 100 characters");
    }
    return trimmed;
  }
}