/** PrismaOrderRepository — Order 仓储实现 */
import { Injectable } from "@nestjs/common";
import { Order } from "../../../domain/order/order.entity.js";
import { OrderRepository } from "../../../domain/order/order.repository.port.js";
import { PrismaService } from "./prisma.service.js";
import { OrderMapper } from "../mappers/order.mapper.js";

@Injectable()
export class PrismaOrderRepository implements OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Order | null> {
    const r = await this.prisma.order.findUnique({ where: { id } });
    return r ? OrderMapper.toDomain(r) : null;
  }

  async save(order: Order): Promise<void> {
    const data = OrderMapper.toPersistence(order);
    await this.prisma.order.upsert({
      where: { id: data.id },
      create: data,
      update: { amount: data.amount, status: data.status, updatedAt: data.updatedAt },
    });
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const records = await this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });
    return records.map((r) => OrderMapper.toDomain(r));
  }

  async findAll(): Promise<Order[]> {
    const records = await this.prisma.order.findMany({ orderBy: { createdAt: "asc" } });
    return records.map((r) => OrderMapper.toDomain(r));
  }
}