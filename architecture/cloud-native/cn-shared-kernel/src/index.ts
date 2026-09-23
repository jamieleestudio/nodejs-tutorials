/**
 * @cn/shared-kernel — 云原生共享内核（零框架依赖）
 *
 * - Entity 基础类型
 * - ServiceError：跨服务 HTTP 错误的统一契约
 */

export { Entity } from "./entity.base.js";

/** 服务间 HTTP 调用的统一错误响应 */
export interface ServiceError {
  statusCode: number;
  message: string;
}

/** 12-Factor：所有配置来自环境变量（III. Config） */
export const CONFIG_KEYS = {
  PORT: "PORT",
  DATABASE_URL: "DATABASE_URL",
  USER_SERVICE_URL: "USER_SERVICE_URL",
} as const;
