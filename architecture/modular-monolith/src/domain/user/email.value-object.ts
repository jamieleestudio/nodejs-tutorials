/** Email 值对象（与 monolith 项目相同） */
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

  get value(): string { return this._value; }
  equals(other: Email): boolean { return this._value === other._value; }
  toString(): string { return this._value; }
}