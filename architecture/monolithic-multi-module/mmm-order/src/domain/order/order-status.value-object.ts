/**
 * OrderStatus 值对象
 *
 * 订单状态的有限状态机：
 * PENDING → CONFIRMED → SHIPPED → DELIVERED
 *                     ↘ CANCELLED
 *
 * 值对象封装状态转换规则，确保不会出现非法转换
 * （如从 DELIVERED 转回 PENDING）。
 */

export type OrderStatusValue = "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";

const VALID_TRANSITIONS: Record<OrderStatusValue, OrderStatusValue[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

export class OrderStatus {
  private constructor(private readonly _value: OrderStatusValue) {}

  static create(value: OrderStatusValue): OrderStatus {
    return new OrderStatus(value);
  }

  static pending(): OrderStatus {
    return new OrderStatus("PENDING");
  }

  get value(): OrderStatusValue {
    return this._value;
  }

  /** 检查是否可以转换到目标状态 */
  canTransitionTo(target: OrderStatusValue): boolean {
    return VALID_TRANSITIONS[this._value].includes(target);
  }

  /** 执行状态转换，非法转换抛出异常 */
  transitionTo(target: OrderStatusValue): OrderStatus {
    if (!this.canTransitionTo(target)) {
      throw new Error(`Cannot transition from ${this._value} to ${target}`);
    }
    return new OrderStatus(target);
  }

  equals(other: OrderStatus): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}