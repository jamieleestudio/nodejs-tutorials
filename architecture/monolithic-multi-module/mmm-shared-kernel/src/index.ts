/**
 * @mmm/shared-kernel — 共享内核
 *
 * 职责（对齐 java mmm-shared-kernel：零框架依赖）：
 * - 领域基础类型：Entity / AggregateRoot
 * - 跨模块集成事件契约：OrderCreatedEvent
 *   （Order 模块发布、User 模块订阅；放在共享内核以保证模块依赖图无环：
 *    bootstrap → order → user → shared-kernel）
 */

export { Entity } from "./entity.base.js";
export { AggregateRoot } from "./aggregate-root.base.js";
export { OrderCreatedEvent } from "./events/order-created.event.js";
