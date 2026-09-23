import { CreateUserCommand } from "./commands/create-user.command.js";
import { GetUserQuery } from "./queries/get-user.query.js";
import { UserDto } from "./dto/user.dto.js";
export const USER_APPLICATION_SERVICE = Symbol("USER_APPLICATION_SERVICE");
export interface UserApplicationService {
  createUserCommand(command: CreateUserCommand): Promise<UserDto>;
  getUserQuery(query: GetUserQuery): Promise<UserDto>;
}