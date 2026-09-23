import { User } from "./user.entity.js";
export const USER_DOMAIN_SERVICE = Symbol("USER_DOMAIN_SERVICE");
export interface UserDomainService {
  createUser(email: string, name: string): Promise<User>;
}