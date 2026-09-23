/** UserService — 用户服务（云原生：无状态，可水平扩容） */
import { Inject, Injectable } from "@nestjs/common";
import { User, USER_REPOSITORY, UserRepository } from "../domain/user/user.entity.js";

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
  ) {}

  async createUser(input: { email: string; name: string }): Promise<User> {
    const user = User.create(input);
    await this.userRepository.save(user);
    return user;
  }

  async getUser(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }
}
