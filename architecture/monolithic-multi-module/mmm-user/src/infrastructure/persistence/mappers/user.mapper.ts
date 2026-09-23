/** User Mapper */
import { User } from "../../../domain/user/user.entity.js";

interface UserPrismaModel {
  id: string; email: string; name: string; createdAt: Date; updatedAt: Date;
}

export class UserMapper {
  static toDomain(m: UserPrismaModel): User {
    return User.reconstitute({ id: m.id, email: m.email, name: m.name, createdAt: m.createdAt, updatedAt: m.updatedAt });
  }
  static toPersistence(user: User): UserPrismaModel {
    return { id: user.id, email: user.email.value, name: user.name, createdAt: user.createdAt, updatedAt: user.updatedAt };
  }
}