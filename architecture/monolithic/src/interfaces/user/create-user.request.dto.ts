/**
 * 创建用户 HTTP 请求 DTO
 *
 * interfaces 层专用，使用 class-validator 装饰器声明校验规则。
 * 与 application 层的 CreateUserDto（纯接口）分离：
 * - HTTP 校验在此层完成
 * - 通过后转为 application 层 DTO 传入用例
 */

import { IsEmail, IsString, MinLength, MaxLength } from "class-validator";

export class CreateUserRequestDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name!: string;
}