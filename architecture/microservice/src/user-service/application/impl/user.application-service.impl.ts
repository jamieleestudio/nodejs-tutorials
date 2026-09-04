/** UserApplicationService — 应用服务（@Injectable，协调领域服务与仓储） */
import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { USER_REPOSITORY, UserRepository } from "../../domain/user/user.repository.port.js";
import { USER_DOMAIN_SERVICE, UserDomainService } from "../../domain/user/user.domain-service.port.js";
import { UserDto } from "../dto/user.dto.js";
import { CreateUserCommand } from "../commands/create-user.command.js";
import { GetUserQuery } from "../queries/get-user.query.js";
import { UserApplicationService } from "../user.application-service.port.js";

@Injectable()
export class UserApplicationServiceImpl implements UserApplicationService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly repo: UserRepository,
    @Inject(USER_DOMAIN_SERVICE) private readonly domainService: UserDomainService,
  ) {}

  async createUserCommand(command: CreateUserCommand): Promise<UserDto> {
    const user = await this.domainService.createUser(command.email, command.name);
    return { id: user.id, email: user.email.value, name: user.name };
  }

  async getUserQuery(query: GetUserQuery): Promise<UserDto> {
    const user = await this.repo.findById(query.id);
    if (!user) throw new NotFoundException(`User "${query.id}" not found`);
    return { id: user.id, email: user.email.value, name: user.name };
  }
}