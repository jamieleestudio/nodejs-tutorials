/**
 * TypeScript 数据类型体系
 *
 * 知识点：
 * 1. 原始类型（Primitive Types）：string / number / boolean / null / undefined / symbol / bigint
 * 2. 引用类型（Reference Types）：object / array / function
 * 3. 特殊类型：any / unknown / never / void
 * 4. 元组（Tuple）：固定长度和类型的数组
 * 5. 字面量类型（Literal Types）与联合字面量
 * 6. 类型断言（Type Assertions）与类型守卫
 * 7. 包装对象与原始值的区别
 */

export const DESCRIPTION = "Learn TypeScript primitive types, reference types, any/unknown/never/void, tuples, literal types, and type assertions.";

export function run(): void {
  console.log("Data Types");

  // --- 1. 原始类型（Primitive Types）---
  // TS 中的原始类型共 7 种，按值传递，不可变（immutable）

  // string：文本字符串
  const text: string = "hello";
  console.log(`- string: "${text}" (length=${text.length})`);

  // number：数字（整数、浮点数、六进制、二进制、八进制）
  const integer: number = 42;
  const float: number = 3.14;
  const hex: number = 0xff;     // 十六进制 255
  const binary: number = 0b1010; // 二进制 10
  console.log(`- number: int=${integer}, float=${float}, hex=${hex}, binary=${binary}`);

  // boolean：真值（true / false）
  const flag: boolean = true;
  console.log(`- boolean: ${flag}`);

  // null：显式表示"空值"，类型为 null（非 object）
  const empty: null = null;
  console.log(`- null: ${empty}`);

  // undefined：已声明但未赋值
  const notSet: undefined = undefined;
  console.log(`- undefined: ${notSet}`);

  // symbol：全局唯一且不可变的值，常用于对象唯一键
  const sym1: symbol = Symbol("id");
  const sym2: symbol = Symbol("id");
  console.log(`- symbol: sym1 === sym2? ${sym1 === sym2} (always false)`);

  // bigint：大于 Number.MAX_SAFE_INTEGER 的大整数（2^53 - 1 以上）
  const big: bigint = 9007199254740993n;
  console.log(`- bigint: ${big} (typeof=${typeof big})`);

  // --- 2. 引用类型（Reference Types）---
  // 按引用传递，可变（mutable）

  // object：用 interface 或 type 定义形状
  interface Point { x: number; y: number }
  const point: Point = { x: 1, y: 2 };
  console.log(`- object: ${JSON.stringify(point)}`);

  // array：元素类型相同的有序集合
  const arr: number[] = [1, 2, 3];
  console.log(`- array: ${JSON.stringify(arr)}`);

  // function：函数也是一等公民（可作为值传递）
  const fn: (x: number) => number = (x) => x + 1;
  console.log(`- function: fn(5) = ${fn(5)}`);

  // --- 3. 特殊类型 ---

  // any：关闭类型检查，可以赋值给任何类型（危险，应避免使用）
  let anything: any = 10;
  anything = "string";  // 不报错
  anything = true;      // 不报错
  console.log(`- any: ${anything} (type disabled)`);

  // unknown：类型安全版的 any，必须先做类型检查才能操作
  let uncertain: unknown = "maybe a string";
  // uncertain.toUpperCase();  // TS 报错：'uncertain' is of type 'unknown'
  if (typeof uncertain === "string") {
    console.log(`- unknown: after check, length=${uncertain.length}`);
  }

  // void：函数无返回值时的返回类型
  function log(message: string): void {
    console.log(`- void: ${message}`);
  }
  log("no return value");

  // never：永不到达的类型，用于抛异常或无限循环的函数
  function throwError(msg: string): never {
    throw new Error(msg);
    // 以下代码不可达
  }
  function infiniteLoop(): never {
    while (true) {
      // 永不返回
    }
  }
  console.log("- never: functions that throw or loop forever");

  // --- 4. 元组（Tuple）---
  // 固定长度、每个位置类型可不同的数组
  const tuple: [string, number, boolean] = ["Alice", 30, true];
  console.log(`- tuple: ${JSON.stringify(tuple)}`);
  console.log(`- tuple[0] (name) = ${tuple[0]} (string)`);
  console.log(`- tuple[1] (age) = ${tuple[1]} (number)`);
  console.log(`- tuple[2] (active) = ${tuple[2]} (boolean)`);

  // 可选元素的元组：最后一个元素用 ? 标记
  const optionalTuple: [string, number?] = ["Bob"];
  console.log(`- tuple (optional): ${JSON.stringify(optionalTuple)}`);

  // 实际用途：HTTP 响应 [status, body]
  const response: [number, string] = [200, "OK"];
  console.log(`- tuple (http): ${response[0]} ${response[1]}`);

  // --- 5. 字面量类型（Literal Types）---
  // 将变量限制为某个具体的值而非宽泛的类型

  // 字符串字面量类型
  type Color = "red" | "green" | "blue";
  const color: Color = "red";
  console.log(`- literal (string): color = ${color}`);

  // 数字字面量类型
  type Dice = 1 | 2 | 3 | 4 | 5 | 6;
  const roll: Dice = 4;
  console.log(`- literal (number): dice = ${roll}`);

  // 布尔字面量类型（实际只有 true | false，等价于 boolean）
  type Truthy = true;
  const alwaysTrue: Truthy = true;
  console.log(`- literal (boolean): ${alwaysTrue}`);

  // --- 6. 类型断言（Type Assertions）---
  // 告诉 TS 某个值的确切类型，绕过推断（需谨慎使用）

  // 方式一：尖括号语法（在 .tsx 中不可用）
  const raw: unknown = "type assertion";
  const len: number = (<string>raw).length;
  console.log(`- assertion (<...>): length = ${len}`);

  // 方式二：as 语法（推荐，兼容 .tsx）
  const value: unknown = 42;
  const num = value as number;
  console.log(`- assertion (as): ${num * 2}`);

  // 非空断言（!）：断言值不为 null 或 undefined
  const maybeNull: string | null = "not null";
  const definitelyString: string = maybeNull!;
  console.log(`- non-null assertion (!): ${definitelyString}`);

  // --- 7. 包装对象与原始值的区别 ---
  // 原始类型有对应的包装对象，但应始终使用原始类型（小写）
  const primitiveStr: string = "primitive";     // 推荐
  // const objectStr: String = new String("object");  // 不推荐，typeof 为 object
  console.log(`- primitive: typeof "${primitiveStr}" = ${typeof primitiveStr}`);
  // typeof new String("x") === "object"  // 而非 "string"

  // 原始类型方法调用：JS 自动创建临时包装对象，调用后销毁
  console.log(`- wrapper: "hello".toUpperCase() = ${"hello".toUpperCase()}`);
  // 不会创建永久的 String 对象
}