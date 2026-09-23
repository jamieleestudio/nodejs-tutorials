/**
 * @mmm/user — User 限界上下文公共 API
 *
 * 只导出模块装配与端口；领域实体 / DTO 不对外导出，
 * 其他上下文只能通过 USER_REPOSITORY / UserModule 与本模块交互。
 */

export { UserModule } from "./user.module.js";
export { UserPersistenceModule } from "./infrastructure/persistence/prisma/persistence.module.js";
export { USER_REPOSITORY, UserRepository } from "./domain/user/user.repository.port.js";
export { USER_APPLICATION_SERVICE, UserApplicationService } from "./application/user.application-service.port.js";

/** 仅供其他上下文做类型引用（不产生运行时耦合） */
export type { User } from "./domain/user/user.entity.js";
