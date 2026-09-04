/**
 * OrderCreatedEvent — 领域事件
 *
 * 当订单创建时由 Order 聚合根收集。
 * 在 modular-monolith 架构中，此事件通过 CQRS EventBus 发布，
 * UserModule 监听此事件而不直接依赖 OrderModule — 实现模块间解耦。
 *
 * 领域事件是纯数据结构，不包含行为逻辑。
 */

export class OrderCreatedEvent {
  constructor(
    public readonly orderId: string,
    public readonly userId: string,
    public readonly amount: number,
    public readonly occurredAt: Date = new Date(),
  ) {}
}