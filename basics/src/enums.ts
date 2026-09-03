/**
 * TypeScript 枚举
 *
 * 知识点：
 * 1. 数字枚举（Numeric Enums）
 * 2. 字符串枚举（String Enums）
 * 3. const enum（编译时内联）
 * 4. 枚举反向映射（Reverse Mapping）
 * 5. 异构枚举（Heterogeneous Enums，不推荐）
 */

export const DESCRIPTION = "Learn numeric enums, string enums, const enum, and reverse mapping.";

/**
 * 数字枚举：不指定值时从 0 开始递增
 * 第一个成员为 0，后续依次 +1
 */
enum Direction {
  Up,       // 0
  Down,     // 1
  Left,     // 2
  Right,    // 3
}

/**
 * 字符串枚举：每个成员必须显式指定字符串值
 * 字符串枚举没有反向映射
 */
enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
  Pending = "PENDING",
}

/**
 * const enum：编译时完全内联，不会生成运行时对象
 * 适合不需要运行时枚举对象的场景，减少打包体积
 */
const enum LogLevel {
  Debug = 0,
  Info = 1,
  Warn = 2,
  Error = 3,
}

/**
 * 带初始值的数字枚举：从指定值开始递增
 */
enum HttpStatus {
  Ok = 200,
  NotFound = 404,
  ServerError = 500,
}

export function run(): void {
  console.log("Enums");

  // --- 1. 数字枚举 ---
  const dir: Direction = Direction.Up;
  console.log(`- numeric: Direction.Up = ${dir}`);
  console.log(`- numeric: Direction.Down = ${Direction.Down}`);
  console.log(`- numeric: Direction.Left = ${Direction.Left}`);
  console.log(`- numeric: Direction.Right = ${Direction.Right}`);

  // --- 2. 字符串枚举 ---
  const status: Status = Status.Active;
  console.log(`- string: Status.Active = ${status}`);
  console.log(`- string: Status.Pending = ${Status.Pending}`);

  // 字符串枚举值就是字符串，可直接用于字符串比较
  if (status === "ACTIVE") {
    console.log("- string: comparison works with literal");
  }

  // --- 3. const enum ---
  // 编译时直接替换为对应的字面量值，无运行时对象
  const level: LogLevel = LogLevel.Warn;
  console.log(`- const enum: LogLevel.Warn = ${level}`);
  // 编译后 console.log 中会直接是数字 2

  // --- 4. 枚举反向映射 ---
  // 数字枚举支持反向映射：可以通过值找到键名
  // 正向：键 -> 值
  console.log(`- reverse: Direction["Up"] = ${Direction.Up}`);
  // 反向：值 -> 键名
  console.log(`- reverse: Direction[0] = ${Direction[0]}`);
  console.log(`- reverse: Direction[1] = ${Direction[1]}`);

  // 字符串枚举不支持反向映射
  // Status["ACTIVE"]  // TS 报错或返回 undefined

  // --- 5. 带初始值的枚举 ---
  console.log(`- http: HttpStatus.Ok = ${HttpStatus.Ok}`);
  console.log(`- http: HttpStatus.NotFound = ${HttpStatus.NotFound}`);
  console.log(`- http: HttpStatus.ServerError = ${HttpStatus.ServerError}`);

  // 实际用途：HTTP 状态码、权限级别、配置标记等
  enum Permission {
    Read = 1,     // 二进制 001
    Write = 2,    // 二进制 010
    Execute = 4,  // 二进制 100
  }
  // 位运算组合权限
  const readWrite = Permission.Read | Permission.Write;
  console.log(`- bitmask: Read | Write = ${readWrite}`);
  console.log(`- bitmask: has Write? ${(readWrite & Permission.Write) !== 0}`);
  console.log(`- bitmask: has Execute? ${(readWrite & Permission.Execute) !== 0}`);
}