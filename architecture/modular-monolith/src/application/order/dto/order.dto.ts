/** Order 输出 DTO */
export interface OrderDto {
  readonly id: string;
  readonly userId: string;
  readonly amount: number;
  readonly status: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}