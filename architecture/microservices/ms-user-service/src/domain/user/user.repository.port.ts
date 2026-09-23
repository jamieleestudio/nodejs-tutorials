/** User 仓储接口 */
import { User } from "./user.entity.js";
export const USER_REPOSITORY = Symbol("USER_REPOSITORY");
export interface UserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
}