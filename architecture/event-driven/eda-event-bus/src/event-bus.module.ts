/**
 * EventBusModule — 事件总线装配（每个服务各自 import）
 */

import { Module, DynamicModule, FactoryProvider } from "@nestjs/common";
import { RedisEventBus, REDIS_URL } from "./redis-event-bus.js";

@Module({})
export class EventBusModule {
  /** forRoot(redisUrl?) — 默认读取 REDIS_URL 环境变量 */
  static forRoot(redisUrl?: string): DynamicModule {
    const urlProvider: FactoryProvider<string> = {
      provide: REDIS_URL,
      useFactory: () => redisUrl ?? process.env.REDIS_URL ?? "redis://localhost:6379/0",
    };
    return {
      module: EventBusModule,
      providers: [urlProvider, { provide: RedisEventBus, useFactory: (url: string) => new RedisEventBus(url), inject: [REDIS_URL] }],
      exports: [RedisEventBus],
    };
  }
}
