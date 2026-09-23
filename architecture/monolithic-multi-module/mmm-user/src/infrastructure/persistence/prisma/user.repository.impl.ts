/** PrismaUserRepository — User 仓储实现 */
import { Injectable } from "@nestjs/common";
import { User } from "../../../domain/user/user.entity.js";
import { UserRepository } from "../../../domain/user/user.repository.port.js";
import { PrismaService } from "./prisma.service.js";
import { UserMapper } from "../mappers/user.mapper.js";

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const r = await this.prisma.user.findUnique({ where: { id } });
    return r ? UserMapper.toDomain(r) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const r = await this.prisma.user.findUnique({ where: { email } });
    return r ? UserMapper.toDomain(r) : null;
  }

  async save(user: User): Promise<void> {
    const data = UserMapper.toPersistence(user);
    await this.prisma.user.upsert({
      where: { id: data.id },
      create: data,
      update: { email: data.email, name: data.name, updatedAt: data.updatedAt },
    });
  }

  async findAll(): Promise<User[]> {
    const records = await this.prisma.user.findMany({ orderBy: { createdAt: "asc" } });
    return records.map((r) => UserMapper.toDomain(r));
  }
}