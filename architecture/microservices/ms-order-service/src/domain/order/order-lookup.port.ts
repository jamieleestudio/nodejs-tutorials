export const USER_LOOKUP_PORT = Symbol("USER_LOOKUP_PORT");
export interface UserLookupPort {
  getUserById(id: string): Promise<{ id: string; name: string; email: string } | null>;
}