/**
 * UserLookupPort — 用户查询端口（domain 层定义）
 *
 * XII. Backing services：User 服务是"附加资源"，
 * 通过 URL（env）定位，实现是 HTTP 客户端。
 */

export interface UserLookupPort {
  getUserById(id: string): Promise<{ id: string; name: string; email: string } | null>;
}

export const USER_LOOKUP_PORT = Symbol("USER_LOOKUP_PORT");
