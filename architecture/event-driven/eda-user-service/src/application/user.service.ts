/**
 * UserService — 用户服务（事件消费者）
 *
 * - createUsers：提供 HTTP POST /users（演示数据准备）
 * - onApplicationBootstrap：订阅 order.created，收到事件后做出反应
 *
 * 消费者不知道发布者是谁 —— 只依赖 @eda/shared-kernel 里的 topic 契约。
 */

import { Inject, Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { RedisEventBus } from "@eda/event-bus";
import { OrderCreatedPayload, TOPICS } from "@eda/shared-kernel";
import { User, USER_REPOSITORY, UserRepository } from "../domain/user/user.entity.js";

@Injectable()
export class UserService implements OnApplicationBootstrap {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    private readonly eventBus: RedisEventBus,
  ) {}

  async createUser(input: { email: string; name: string }): Promise<User> {
    const user = User.create(input);
    await this.userRepository.save(user);
    return user;
  }

  async getUser(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  /** 订阅集成事件 —— 服务启动时注册 */
  async onApplicationBootstrap(): Promise<void> {
    await this.eventBus.subscribe(TOPICS.ORDER_CREATED, async (envelope) => {
      const payload = envelope.payload as OrderCreatedPayload;
      const user = await this.userRepository.findById(payload.userId);
      this.logger.log(
        `📬 order.created received: user "${user?.name ?? payload.userId}" notified about order ${payload.orderId} (amount: ${payload.amount})`,
      );
    });
  }
}
