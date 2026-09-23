/** UserDomainService — 领域服务（纯 TS，无 DI 装饰器） */
import { User } from "../user.entity.js";
import { UserRepository } from "../user.repository.port.js";
import { UserDomainService } from "../user.domain-service.port.js";

export class UserDomainServiceImpl implements UserDomainService {
  constructor(private readonly repo: UserRepository) {}

  /** 创建 User 实体并持久化 */
  async createUser(email: string, name: string): Promise<User> {
    const user = User.create({ email, name });
    await this.repo.save(user);
    return user;
  }
}