/**
 * Order 领域服务实现（Domain Service Implementation）
 *
 * 封装跨实体的领域逻辑：
 * - 创建订单时验证用户存在（需要 UserRepository）
 * - 检查用户是否有过多未完成订单（业务规则示例）
 *
 * 纯领域类，不使用 @Injectable()，不调用 save()。
 * 由 Application Service 注入 Repository 后调用。
 */

import { User } from "../../user/user.entity.js";
import { Order } from "../order.entity.js";
import { OrderRepository } from "../order.repository.port.js";
import { UserRepository } from "../../user/user.repository.port.js";
import { OrderDomainService } from "../order.domain-service.port.js";

export class OrderDomainServiceImpl implements OrderDomainService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly orderRepository: OrderRepository,
  ) {}

  /**
   * 验证用户存在并可创建订单
   * 领域规则：用户必须存在；未完成订单不超过 5 个
   */
  async validateUserForOrder(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error(`User with id "${userId}" not found`);
    }

    const existingOrders = await this.orderRepository.findByUserId(userId);
    const pendingCount = existingOrders.filter(
      (o) => o.status.value === "PENDING" || o.status.value === "CONFIRMED",
    ).length;

    if (pendingCount >= 5) {
      throw new Error(`User "${user.name}" has too many pending orders (${pendingCount})`);
    }

    return user;
  }

  /**
   * 创建订单聚合根
   * 返回未持久化的 Order 实体（含领域事件）
   */
  createOrder(userId: string, amount: number): Order {
    return Order.create({ userId, amount });
  }
}