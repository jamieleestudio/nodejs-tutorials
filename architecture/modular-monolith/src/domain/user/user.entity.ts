/** User 领域实体 */
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

  static create(params: { id?: string; email: string; name: string }): User {
    const now = new Date();
    return new User(
      params.id ?? crypto.randomUUID(),
      new Email(params.email),
      User.validateName(params.name),
      now, now,
    );
  }

  static reconstitute(params: {
    id: string; email: string; name: string; createdAt: Date; updatedAt: Date;
  }): User {
    return new User(params.id, new Email(params.email), params.name, params.createdAt, params.updatedAt);
  }

  get email(): Email { return this._email; }
  get name(): string { return this._name; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  private static validateName(name: string): string {
    const trimmed = name.trim();
    if (trimmed.length === 0) throw new Error("User name cannot be empty");
    if (trimmed.length > 100) throw new Error("User name cannot exceed 100 characters");
    return trimmed;
  }
}