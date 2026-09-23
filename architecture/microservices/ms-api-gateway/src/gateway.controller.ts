/**
 * API Gateway 路由控制器
 *
 * 网关是微服务架构的唯一 HTTP 入口：
 * - /users/** → User Service（HTTP）
 * - /orders/** → Order Service（HTTP；Order 内部再通过 TCP RPC 调 User）
 *
 * 客户端永远不需要知道后端服务的地址（服务发现的简化版：静态配置 env）。
 */

import { Controller, Post, Get, Body, Param, Req, Res, Inject } from "@nestjs/common";
import type { Request, Response } from "express";

export const USER_SERVICE_URL = "USER_SERVICE_URL";
export const ORDER_SERVICE_URL = "ORDER_SERVICE_URL";

@Controller()
export class GatewayController {
  constructor(
    @Inject(USER_SERVICE_URL) private readonly userServiceUrl: string,
    @Inject(ORDER_SERVICE_URL) private readonly orderServiceUrl: string,
  ) {}

  @Post("users")
  async createUser(@Req() req: Request, @Res() res: Response) {
    await this.forward(req, res, this.userServiceUrl, "/users");
  }

  @Get("users/:id")
  async getUser(@Req() req: Request, @Res() res: Response) {
    await this.forward(req, res, this.userServiceUrl, `/users/${req.params.id}`);
  }

  @Post("orders")
  async createOrder(@Req() req: Request, @Res() res: Response) {
    await this.forward(req, res, this.orderServiceUrl, "/orders");
  }

  @Get("orders/:id")
  async getOrder(@Req() req: Request, @Res() res: Response) {
    await this.forward(req, res, this.orderServiceUrl, `/orders/${req.params.id}`);
  }

  private async forward(req: Request, res: Response, target: string, path: string): Promise<void> {
    const hasBody = req.method !== "GET" && req.method !== "HEAD";
    try {
      const upstream = await fetch(`${target}${path}`, {
        method: req.method,
        headers: { "Content-Type": "application/json" },
        body: hasBody ? JSON.stringify(req.body ?? {}) : undefined,
      });
      const data = await upstream.json().catch(() => ({}));
      res.status(upstream.status).json(data);
    } catch (error) {
      res.status(502).json({
        statusCode: 502,
        message: `Upstream ${target} unreachable: ${(error as Error).message}`,
      });
    }
  }
}
