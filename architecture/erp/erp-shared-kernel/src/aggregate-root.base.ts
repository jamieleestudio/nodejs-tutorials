/** 聚合根基类 — 收集领域事件，由 application 层在事务后发布 */

import { Entity } from "./entity.base.js";

export abstract class AggregateRoot<TId = string> extends Entity<TId> {
  private _events: unknown[] = [];

  protected addEvent(event: unknown): void {
    this._events.push(event);
  }

  /** 取出并清除所有领域事件 */
  pullEvents(): unknown[] {
    const events = [...this._events];
    this._events = [];
    return events;
  }
}
