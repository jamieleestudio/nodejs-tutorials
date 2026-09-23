/**
 * DomainError — 领域业务错误
 *
 * domain 层抛出的统一异常类型；platform 层的异常过滤器
 * 把它映射为 HTTP 400（领域层自身不知道 HTTP 的存在）。
 */
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainError";
  }
}
