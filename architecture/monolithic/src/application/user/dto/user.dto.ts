/**
 * 用户输出 DTO
 *
 * application 层返回给 interfaces 层的数据结构。
 * 不直接返回领域实体 User，而是通过 DTO 隔离领域层与外部。
 */
export interface UserDto {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}