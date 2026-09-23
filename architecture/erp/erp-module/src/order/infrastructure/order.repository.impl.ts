/** PrismaOrderRepository（复用模块内共享的 PrismaService） */
import { Inject, Injectable } from "@nestjs/common";
import { Order, OrderRepository } from "../domain/order.entity.js";
import { PrismaService } from "../../user/infrastructure/prisma.service.js";

@Injectable()
export class PrismaOrderRepository implements OrderRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async save(order: Order): Promise<void> {
    await this.prisma.order.create({
      data: { id: order.id, userId: order.userId, amount: order.amount, status: order.status },
    });
  }

  async findById(id: string): Promise<Order | null> {
    const r = await this.prisma.order.findUnique({ where: { id } });
    return r ? Order.fromRow(r) : null;
  }
}
