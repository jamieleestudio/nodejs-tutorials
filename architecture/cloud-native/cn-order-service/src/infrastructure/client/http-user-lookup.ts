/**
 * HttpUserLookup — UserLookupPort 的 HTTP 适配器
 *
 * XII. Backing services：User 服务通过 USER_SERVICE_URL（env）定位。
 * 真实生产中这里应是服务发现 + 负载均衡 + 重试/熔断（本教程用 fetch 演示）。
 */

import { Injectable } from "@nestjs/common";
import { UserLookupPort } from "../../domain/order/user-lookup.port.js";

@Injectable()
export class HttpUserLookup implements UserLookupPort {
  constructor(private readonly userServiceUrl: string) {}

  async getUserById(id: string): Promise<{ id: string; name: string; email: string } | null> {
    try {
      const res = await fetch(`${this.userServiceUrl}/users/${id}`);
      if (!res.ok) return null;
      return (await res.json()) as { id: string; name: string; email: string };
    } catch {
      return null;
    }
  }
}
