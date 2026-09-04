/**
 * 创建用户输入 DTO
 *
 * 从 interfaces 层传入 application 层的数据结构。
 * 不包含 HTTP 相关注解（@IsEmail 等），保持应用层与框架解耦。
 */
export interface CreateUserDto {
  readonly email: string;
  readonly name: string;
}