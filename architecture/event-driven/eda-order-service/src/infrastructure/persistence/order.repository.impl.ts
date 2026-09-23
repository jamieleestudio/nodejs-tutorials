/** PrismaOrderRepository */
import { Injectable } from "@nestjs/common";
import { Order, OrderRepository } from "../../domain/order/order.entity.js";
import { PrismaService } from "./prisma.service.js";

@Injectable()
export class PrismaOrderRepository implements OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

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
