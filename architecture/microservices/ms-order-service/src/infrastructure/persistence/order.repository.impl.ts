/** PrismaOrderRepository */
import { Injectable } from "@nestjs/common";
import { Order, OrderStatus } from "../../domain/order/order.entity.js";
import { OrderRepository } from "../../domain/order/order.repository.port.js";
import { PrismaService } from "./prisma.service.js";

@Injectable()
export class PrismaOrderRepository implements OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Order | null> {
    const r = await this.prisma.order.findUnique({ where: { id } });
    return r ? Order.reconstitute({ id: r.id, userId: r.userId, amount: r.amount, status: r.status as OrderStatus, createdAt: r.createdAt, updatedAt: r.updatedAt }) : null;
  }

  async save(order: Order): Promise<void> {
    await this.prisma.order.upsert({
      where: { id: order.id },
      create: { id: order.id, userId: order.userId, amount: order.amount, status: order.status },
      update: { amount: order.amount, status: order.status },
    });
  }
}