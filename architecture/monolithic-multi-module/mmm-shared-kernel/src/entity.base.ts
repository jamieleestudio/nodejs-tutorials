/**
 * 领域实体基类
 * 与 monolith 项目相同，提供唯一标识符和相等性比较。
 */
export abstract class Entity<TId = string> {
  protected readonly _id: TId;

  constructor(id: TId) {
    this._id = id;
  }

  get id(): TId {
    return this._id;
  }

  equals(other?: Entity<TId>): boolean {
    if (other === undefined || other === null) return false;
    if (this === other) return true;
    return this._id === other._id;
  }
}