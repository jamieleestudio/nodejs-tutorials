/**
 * OrderApplicationService — 订单应用服务实现
 *
 * 替代多个 CQRS CommandHandler + QueryHandler（8 个文件 → 1 个文件）。
 *
 * 重构变化：
 * - 不再使用 CommandBus / QueryBus 分发
 * - Controller 直接注入此服务调用方法
 * - 采用 CQRS 命名约定（Command/Query 后缀），但无 Bus 分发
 * - 领域服务通过端口接口 + DI token 注入
 * - 领域事件仍通过 EventBus 发布（保留模块解耦核心价值）
 *
 * 职责：
 * 1. 调用 Domain Service 做跨实体业务校验
 * 2. 编排持久化
 * 3. 发布领域事件到 EventBus
 * 4. 返回 DTO
 */

import { Injectable, Inject } from "@nestjs/common";
import { EventBus } from "@nestjs/cqrs";
import { Order } from "../../../domain/order/order.entity.js";
import { ORDER_REPOSITORY, OrderRepository } from "../../../domain/order/order.repository.port.js";
import { ORDER_DOMAIN_SERVICE, OrderDomainService } from "../../../domain/order/order.domain-service.port.js";
import { CreateOrderCommand } from "../commands/create-order.command.js";
import { GetOrderQuery } from "../queries/get-order.query.js";
import { GetOrdersByUserQuery } from "../queries/get-orders-by-user.query.js";
import { OrderDto } from "../dto/order.dto.js";
import { OrderApplicationService } from "../order.application-service.port.js";
import type { IEvent } from "@nestjs/cqrs";

@Injectable()
export class OrderApplicationServiceImpl implements OrderApplicationService {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository,
    @Inject(ORDER_DOMAIN_SERVICE) private readonly orderDomainService: OrderDomainService,
    private readonly eventBus: EventBus,
  ) {}

  /** 创建订单（写操作 + 发布领域事件） */
  async createOrderCommand(command: CreateOrderCommand): Promise<OrderDto> {
    // 1. 领域校验（跨实体：验证用户存在 + 未完成订单限制）
    await this.orderDomainService.validateUserForOrder(command.userId);

    // 2. 创建聚合根（领域事件在工厂方法内收集）
    const order = this.orderDomainService.createOrder(command.userId, command.amount);

    // 3. 持久化
    await this.orderRepository.save(order);

    // 4. 发布领域事件到 EventBus（UserModule 监听，不直接依赖）
    const events = order.pullEvents() as IEvent[];
    for (const event of events) {
      this.eventBus.publish(event);
    }

    return this.toDto(order);
  }

  /** 查询订单（读操作） */
  async getOrderQuery(query: GetOrderQuery): Promise<OrderDto> {
    const order = await this.orderRepository.findById(query.id);
    if (!order) {
      throw new Error(`Order with id "${query.id}" not found`);
    }
    return this.toDto(order);
  }

  /** 按用户查询订单 */
  async getOrdersByUserQuery(query: GetOrdersByUserQuery): Promise<OrderDto[]> {
    const orders = await this.orderRepository.findByUserId(query.userId);
    return orders.map((order) => this.toDto(order));
  }

  private toDto(order: Order): OrderDto {
    return {
      id: order.id,
      userId: order.userId,
      amount: order.amount,
      status: order.status.value,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}