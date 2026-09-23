/** 创建订单输入 DTO */
export interface CreateOrderDto {
  readonly userId: string;
  readonly amount: number;
}