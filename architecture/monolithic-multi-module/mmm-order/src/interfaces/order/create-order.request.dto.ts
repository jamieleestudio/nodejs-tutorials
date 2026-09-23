/** 创建订单 HTTP 请求 DTO */
import { IsString, IsNumber, Min } from "class-validator";

export class CreateOrderRequestDto {
  @IsString()
  userId!: string;

  @IsNumber()
  @Min(0.01)
  amount!: number;
}