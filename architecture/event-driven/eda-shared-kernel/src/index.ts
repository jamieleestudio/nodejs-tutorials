/**
 * @eda/shared-kernel — 事件驱动架构共享内核
 *
 * 服务之间只通过"事件契约"耦合（零框架依赖）：
 * - 发布方只知道 topic 名 + payload 结构
 * - 订阅方按 topic 订阅，双方不 import 对方代码
 */

/** 事件主题（topic）— 集成事件的唯一契约标识 */
export const TOPICS = {
  ORDER_CREATED: "order.created",
} as const;

export type Topic = (typeof TOPICS)[keyof typeof TOPICS];

/** 事件信封 — 在消息总线上传输的标准结构 */
export interface EventEnvelope<T = unknown> {
  topic: Topic;
  payload: T;
  occurredAt: string;
}

/** order.created 事件的 payload 契约 */
export interface OrderCreatedPayload {
  orderId: string;
  userId: string;
  amount: number;
}
