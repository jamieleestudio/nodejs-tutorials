/** Order 领域实体 */
import { Entity } from "../shared/entity.base.js";

export type OrderStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export class Order extends Entity<string> {
  private _userId: string;
  private _amount: number;
  private _status: OrderStatus;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(id: string, userId: string, amount: number, status: OrderStatus, createdAt: Date, updatedAt: Date) {
    super(id);
    this._userId = userId;
    this._amount = amount;
    this._status = status;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  static create(params: { id?: string; userId: string; amount: number }): Order {
    if (params.amount <= 0) throw new Error("Amount must be positive");
    const now = new Date();
    return new Order(params.id ?? crypto.randomUUID(), params.userId, params.amount, "PENDING", now, now);
  }

  static reconstitute(params: { id: string; userId: string; amount: number; status: OrderStatus; createdAt: Date; updatedAt: Date }): Order {
    return new Order(params.id, params.userId, params.amount, params.status, params.createdAt, params.updatedAt);
  }

  get userId(): string { return this._userId; }
  get amount(): number { return this._amount; }
  get status(): OrderStatus { return this._status; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }
}