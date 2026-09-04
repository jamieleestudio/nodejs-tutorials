/**
 * PrismaUserRepository — User 仓储接口的 Prisma 实现
 *
 * 实现 domain 层定义的 UserRepository 接口（依赖反转）。
 * 通过 UserMapper 在领域实体和 Prisma 模型之间转换。
 *
 * 依赖方向：infrastructure → domain（实现接口）
 * 此类在 infrastructure 层，可以依赖 Prisma（外部库），
 * 但接口定义在 domain 层，domain 层不感知 Prisma 的存在。
 */

import { Injectable } from "@nestjs/common";
import { User } from "../../../domain/user/user.entity.js";
import { UserRepository } from "../../../domain/user/user.repository.port.js";
import { PrismaService } from "./prisma.service.js";
import { UserMapper } from "../mappers/user.mapper.js";

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { id } });
    return record ? UserMapper.toDomain(record) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { email } });
    return record ? UserMapper.toDomain(record) : null;
  }

  async save(user: User): Promise<void> {
    const data = UserMapper.toPersistence(user);
    await this.prisma.user.upsert({
      where: { id: data.id },
      create: data,
      update: {
        email: data.email,
        name: data.name,
        updatedAt: data.updatedAt,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    const records = await this.prisma.user.findMany({
      orderBy: { createdAt: "asc" },
    });
    return records.map((record) => UserMapper.toDomain(record));
  }
}