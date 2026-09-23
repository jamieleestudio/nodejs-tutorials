/** User 实体 + 仓储端口（简化版分层：单文件演示） */

export class User {
  private constructor(
    readonly id: string,
    readonly email: string,
    readonly name: string,
  ) {}

  static create(params: { email: string; name: string }): User {
    if (!params.name.trim()) throw new Error("Name cannot be empty");
    return new User(crypto.randomUUID(), params.email.trim().toLowerCase(), params.name.trim());
  }

  static fromRow(row: { id: string; email: string; name: string }): User {
    return new User(row.id, row.email, row.name);
  }
}

export const USER_REPOSITORY = Symbol("USER_REPOSITORY");

export interface UserRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
}
