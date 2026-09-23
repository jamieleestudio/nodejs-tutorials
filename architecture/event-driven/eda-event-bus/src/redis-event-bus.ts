/**
 * RedisEventBus — 基于 Redis pub/sub 的事件总线
 *
 * 事件驱动架构的通信核心（对齐 java eda 的 MQ 角色，Redis 版本）：
 * - publish(topic, payload)：发布事件信封（fire-and-forget）
 * - subscribe(topic, handler)：订阅事件，收到后反序列化并回调
 *
 * 每个服务独立进程，通过 Redis 交换事件——这是
 * event-driven 与 modular-monolith（进程内 EventBus）的本质区别。
 */

import { Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import Redis from "ioredis";
import type { EventEnvelope, Topic } from "@eda/shared-kernel";

export const REDIS_URL = "REDIS_URL";

type Handler = (envelope: EventEnvelope) => void | Promise<void>;

@Injectable()
export class RedisEventBus implements OnModuleDestroy {
  private readonly logger = new Logger(RedisEventBus.name);
  private readonly publisher: Redis;
  private readonly subscriber: Redis;
  private readonly handlers = new Map<string, Set<Handler>>();

  constructor(url: string) {
    this.publisher = new Redis(url);
    this.subscriber = new Redis(url);

    this.subscriber.on("message", (channel: string, raw: string) => {
      const handlers = this.handlers.get(channel);
      if (!handlers) return;
      let envelope: EventEnvelope;
      try {
        envelope = JSON.parse(raw) as EventEnvelope;
      } catch {
        this.logger.warn(`Invalid envelope on topic "${channel}"`);
        return;
      }
      for (const handler of handlers) {
        void Promise.resolve(handler(envelope)).catch((error: unknown) => {
          this.logger.error(`Handler failed on topic "${channel}": ${(error as Error).message}`);
        });
      }
    });
  }

  /** 发布事件（信封序列化为 JSON 后发布到 topic） */
  async publish<T>(topic: Topic, payload: T): Promise<void> {
    const envelope: EventEnvelope<T> = {
      topic,
      payload,
      occurredAt: new Date().toISOString(),
    };
    await this.publisher.publish(topic, JSON.stringify(envelope));
    this.logger.log(`Published "${topic}"`);
  }

  /** 订阅事件（同一 topic 可注册多个 handler） */
  async subscribe(topic: Topic, handler: Handler): Promise<void> {
    if (!this.handlers.has(topic)) {
      this.handlers.set(topic, new Set());
      await this.subscriber.subscribe(topic);
    }
    this.handlers.get(topic)!.add(handler);
    this.logger.log(`Subscribed to "${topic}"`);
  }

  async onModuleDestroy(): Promise<void> {
    await this.publisher.quit();
    await this.subscriber.quit();
  }
}
