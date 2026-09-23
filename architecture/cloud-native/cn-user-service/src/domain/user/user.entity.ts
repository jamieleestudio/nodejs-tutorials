/** User 实体 + 仓储端口 */
import { Entity } from "@cn/shared-kernel";

export class User extends Entity<string> {
  private constructor(
    readonly email: string,
    readonly name: string,
    id: string,
  ) {
    super(id);
  }

  static create(params: { email: string; name: string }): User {
    if (!params.name.trim()) throw new Error("Name cannot be empty");
    return new User(params.email.trim().toLowerCase(), params.name.trim(), crypto.randomUUID());
  }

  static fromRow(row: { id: string; email: string; name: string }): User {
    return new User(row.email, row.name, row.id);
  }
}

export const USER_REPOSITORY = Symbol("USER_REPOSITORY");

export interface UserRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
}
