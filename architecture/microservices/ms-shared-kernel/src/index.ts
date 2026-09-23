/**
 * @ms/shared-kernel — 微服务共享内核（零框架依赖）
 *
 * 对齐 java ms-shared-kernel：所有服务共享的基础类型。
 */

export { Entity } from "./entity.base.js";

/** 微服务间 TCP 消息契约（Order 服务 → User 服务） */
export const USER_MESSAGE_PATTERNS = {
  createUser: { cmd: "create_user" },
  getUser: { cmd: "get_user" },
} as const;
