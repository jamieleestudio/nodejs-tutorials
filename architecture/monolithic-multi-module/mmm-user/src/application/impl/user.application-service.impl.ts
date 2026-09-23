/**
 * UserApplicationServiceImpl — 用户应用服务实现
 *
 * 职责：
 * 1. 编排领域逻辑（实体工厂方法内做自校验）
 * 2. 编排持久化（通过 Repository Port）
 * 3. 返回 DTO（不暴露领域实体）
 */

import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { User } from "../../domain/user/user.entity.js";
import { USER_REPOSITORY, UserRepository } from "../../domain/user/user.repository.port.js";
import { UserApplicationService } from "../user.application-service.port.js";
import { CreateUserCommand } from "../commands/create-user.command.js";
import { GetUserQuery } from "../queries/get-user.query.js";
import { GetAllUsersQuery } from "../queries/get-all-users.query.js";
import { UserDto } from "../dto/user.dto.js";

@Injectable()
export class UserApplicationServiceImpl implements UserApplicationService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
  ) {}

  async createUserCommand(command: CreateUserCommand): Promise<UserDto> {
    const user = User.create({ email: command.email, name: command.name });
    await this.userRepository.save(user);
    return this.toDto(user);
  }

  async getUserQuery(query: GetUserQuery): Promise<UserDto> {
    const user = await this.userRepository.findById(query.id);
    if (!user) {
      throw new NotFoundException(`User with id "${query.id}" not found`);
    }
    return this.toDto(user);
  }

  async getAllUsersQuery(_query: GetAllUsersQuery): Promise<UserDto[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => this.toDto(user));
  }

  private toDto(user: User): UserDto {
    return {
      id: user.id,
      email: user.email.value,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
