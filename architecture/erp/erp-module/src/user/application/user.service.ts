/** UserService — 用户应用服务 */
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { User, USER_REPOSITORY, UserRepository } from "../domain/user.entity.js";

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

  async getUser(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException(`User "${id}" not found`);
    return user;
  }
}
