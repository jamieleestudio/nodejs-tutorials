/**
 * CreateUserCommand — 写操作参数对象
 *
 * 借鉴 CQRS 命名约定，但不使用 CommandBus 分发。
 * 作为 Application Service 方法的参数传递。
 */

export class CreateUserCommand {
  constructor(
    readonly email: string,
    readonly name: string,
  ) {}
}