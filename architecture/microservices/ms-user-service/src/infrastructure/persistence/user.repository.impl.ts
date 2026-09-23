/** PrismaUserRepository */
import { Injectable } from "@nestjs/common";
import { User } from "../../domain/user/user.entity.js";
import { UserRepository } from "../../domain/user/user.repository.port.js";
import { PrismaService } from "./prisma.service.js";

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const r = await this.prisma.user.findUnique({ where: { id } });
    return r ? User.reconstitute({ id: r.id, email: r.email, name: r.name, createdAt: r.createdAt, updatedAt: r.updatedAt }) : null;
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: user.id },
      create: { id: user.id, email: user.email.value, name: user.name },
      update: { email: user.email.value, name: user.name },
    });
  }
}