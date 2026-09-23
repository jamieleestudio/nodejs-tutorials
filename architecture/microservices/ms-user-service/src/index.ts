/**
 * @ms/user-service — 用户微服务公共 API
 */

export { UserModule } from "./user.module.js";
export { USER_APPLICATION_SERVICE, UserApplicationService } from "./application/user.application-service.port.js";
export type { UserDto } from "./application/dto/user.dto.js";
