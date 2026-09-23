/** 领域实体基类（与其它 shared-kernel 相同，保持各模式自包含） */
export abstract class Entity<TId = string> {
  protected readonly _id: TId;
  constructor(id: TId) { this._id = id; }
  get id(): TId { return this._id; }
  equals(other?: Entity<TId>): boolean {
    if (!other) return false;
    if (this === other) return true;
    return this._id === other._id;
  }
}
