/** PrismaUserRepository */
import { Injectable } from "@nestjs/common";
import { User, UserRepository } from "../../domain/user/user.entity.js";
import { PrismaService } from "./prisma.service.js";

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: User): Promise<void> {
    await this.prisma.user.create({
      data: { id: user.id, email: user.email, name: user.name },
    });
  }

  async findById(id: string): Promise<User | null> {
    const r = await this.prisma.user.findUnique({ where: { id } });
    return r ? User.fromRow(r) : null;
  }
}
