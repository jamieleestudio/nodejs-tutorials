/** OrderDomainService — 领域服务（依赖 UserLookupPort 端口） */
import { Inject } from "@nestjs/common";
import { USER_LOOKUP_PORT, UserLookupPort } from "../order-lookup.port.js";
import { OrderDomainService } from "../order.domain-service.port.js";

export class OrderDomainServiceImpl implements OrderDomainService {
  constructor(
    @Inject(USER_LOOKUP_PORT) private readonly userLookup: UserLookupPort,
  ) {}

  /** 验证用户存在，返回用户信息；不存在则抛错 */
  async validateUserForOrder(userId: string): Promise<{ id: string; name: string; email: string }> {
    const user = await this.userLookup.getUserById(userId);
    if (!user) {
      throw new Error(`User "${userId}" not found in User Microservice`);
    }
    return user;
  }
}