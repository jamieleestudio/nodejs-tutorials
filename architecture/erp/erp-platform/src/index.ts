/**
 * @erp/platform — 平台层（COLA 的 adapter/tech 层）
 *
 * 可复用的技术组件，不含任何业务语义：
 * - envConfig：12-factor 风格配置读取
 * - AllExceptionsFilter：DomainError → 400，其余 → 500
 * - LoggingInterceptor：请求日志
 *
 * 依赖约束（由 @erp/architecture-test 守护）：
 * platform 只能依赖 shared-kernel，禁止依赖 module / app。
 */

export { envConfig } from "./env.config.js";
export { AllExceptionsFilter } from "./all-exceptions.filter.js";
export { LoggingInterceptor } from "./logging.interceptor.js";
