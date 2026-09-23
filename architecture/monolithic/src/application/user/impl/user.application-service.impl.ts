/**
 * UserApplicationService 实现（Implementation）
 *
 * 职责：
 * 1. 编排领域逻辑（调用 Domain Service 做业务校验）
 * 2. 编排持久化（通过 Repository Port）
 * 3. 返回 DTO（不暴露领域实体）
 *
 * 命名约定：
 * - 写操作方法接收 Command 对象：createUserCommand(command)
 * - 读操作方法接收 Query 对象：getUserQuery(query)
 * - 方法名带 Command/Query 后缀，但不使用 CommandBus/QueryBus
 */

import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { User } from "../../../domain/user/user.entity.js";
import { USER_REPOSITORY, UserRepository } from "../../../domain/user/user.repository.port.js";
import { USER_DOMAIN_SERVICE, UserDomainService } from "../../../domain/user/user.domain-service.port.js";
import { UserApplicationService } from "../user.application-service.port.js";
import { CreateUserCommand } from "../commands/create-user.command.js";
import { GetUserQuery } from "../queries/get-user.query.js";
import { GetAllUsersQuery } from "../queries/get-all-users.query.js";
import { UserDto } from "../dto/user.dto.js";

@Injectable()
export class UserApplicationServiceImpl implements UserApplicationService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(USER_DOMAIN_SERVICE) private readonly userDomainService: UserDomainService,
  ) {}

  async createUserCommand(command: CreateUserCommand): Promise<UserDto> {
    const user = await this.userDomainService.createUser(command.email, command.name);
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