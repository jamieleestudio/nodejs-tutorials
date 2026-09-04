/**
 * 领域实体基类
 *
 * 所有领域实体的公共抽象，提供唯一标识符和相等性比较。
 * 实体由其 ID 标识而非属性值（与值对象区分）。
 */
export abstract class Entity<TId = string> {
  protected readonly _id: TId;

  constructor(id: TId) {
    this._id = id;
  }

  get id(): TId {
    return this._id;
  }

  /**
   * 实体的相等性基于 ID，而非属性值
   * 两个实体即使所有属性相同但 ID 不同，也是不同的实体
   */
  equals(other?: Entity<TId>): boolean {
    if (other === undefined || other === null) {
      return false;
    }
    if (this === other) {
      return true;
    }
    return this._id === other._id;
  }
}