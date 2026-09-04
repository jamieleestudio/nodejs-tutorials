/**
 * User 领域服务实现（Implementation）
 *
 * 封装不属于单一实体的领域逻辑：
 * - 检查邮箱唯一性（需要 Repository，但验证规则属于领域层）
 * - 用户创建前的业务规则校验
 *
 * 与 Application Service 的区别：
 * - Domain Service 是纯领域逻辑，不含事务编排、不调用 Repository.save()
 * - Application Service 调用 Domain Service 做业务校验，再编排持久化
 *
 * 与实体方法的区别：
 * - 实体方法装单实体内部规则（如 User.validateName）
 * - Domain Service 封装需要外部数据的领域规则（如查重需要 Repository）
 *
 * 注意：不使用 @Injectable()，保持纯领域类。
 * 注入由 NestJS Module 通过 DI Token 绑定。
 */

import { User } from "../user.entity.js";
import { UserRepository } from "../user.repository.port.js";
import { UserDomainService } from "../user.domain-service.port.js";

export class UserDomainServiceImpl implements UserDomainService {
  constructor(private readonly userRepository: UserRepository) {}

  async ensureEmailAvailable(email: string): Promise<void> {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new Error(`Email "${email}" is already registered`);
    }
  }

  async createUser(email: string, name: string): Promise<User> {
    await this.ensureEmailAvailable(email);
    return User.create({ email, name });
  }
}