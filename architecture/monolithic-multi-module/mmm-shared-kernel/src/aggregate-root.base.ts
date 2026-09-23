/**
 * 聚合根基类
 *
 * 聚合根是 DDD 中的核心概念：
 * - 一组关联实体的"入口点"，外部只能通过聚合根操作其内部实体
 * - 维护聚合内的一致性（不变式）
 * - 收集领域事件，由 application 层在事务提交后发布
 *
 * 与普通 Entity 的区别：聚合根持有领域事件列表，
 * CQRS 的 EventBus 会在用例执行后取出并发布这些事件。
 */

import { Entity } from "./entity.base.js";

export abstract class AggregateRoot<TId = string> extends Entity<TId> {
  private _events: unknown[] = [];

  protected addEvent(event: unknown): void {
    this._events.push(event);
  }

  /** 取出并清除所有领域事件（由 application 层在事务后调用） */
  pullEvents(): unknown[] {
    const events = [...this._events];
    this._events = [];
    return events;
  }
}