/**
 * Email 值对象
 *
 * 值对象特征：
 * - 无唯一标识，由值本身标识（两个相同 email 就是同一个）
 * - 不可变（创建后不可修改）
 * - 自校验（构造时验证格式，不合法则抛出领域异常）
 *
 * 将邮箱校验逻辑内聚在值对象中，而非散落在 Controller 或 Service 里，
 * 这是 DDD 的核心实践：业务规则属于领域层。
 */

export class Email {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private readonly _value: string;

  constructor(value: string) {
    const trimmed = value.trim().toLowerCase();
    if (!Email.EMAIL_REGEX.test(trimmed)) {
      throw new Error(`Invalid email format: "${value}"`);
    }
    this._value = trimmed;
  }

  get value(): string {
    return this._value;
  }

  /**
   * 值对象的相等性基于值本身
   */
  equals(other: Email): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}