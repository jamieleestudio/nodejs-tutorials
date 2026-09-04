/** 创建任务 HTTP 请求 DTO */
import { IsString, MinLength } from "class-validator";

export class CreateTaskRequestDto {
  @IsString()
  @MinLength(1)
  payload!: string;
}