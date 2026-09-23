/** Order DTO */
export interface OrderDto {
  readonly id: string;
  readonly userId: string;
  readonly amount: number;
  readonly status: string;
}