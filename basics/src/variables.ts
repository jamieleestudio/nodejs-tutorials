/**
 * 变量声明与类型系统基础
 *
 * 知识点：
 * 1. const / let / var 的区别与作用域
 * 2. 类型注解 vs 类型推断
 * 3. 联合类型（Union Types）
 * 4. 字面量类型（Literal Types）
 * 5. null 与 undefined
 */

export const DESCRIPTION = "Learn const/let/var, type annotations, union types, literal types, and null/undefined.";

export function run(): void {
  console.log("Variables & Types");

  // --- 1. const / let / var ---
  // const：声明不可新赋值的变量（常量），块级作用域
  const name: string = "Node.js";
  // let：声明可重新赋值的变量，块级作用域
  let count: number = 0;
  count = 1;
  // var：函数级作用域（存在变量提升），现代代码中应避免使用
  // var legacy = "avoid me";  // eslint 会警告
  console.log(`- const name = ${JSON.stringify(name)}`);
  console.log(`- let count = ${count}`);

  // --- 2. 类型注解 vs 类型推断 ---
  // 类型注解：显式声明变量类型
  const version: number = 20.17;
  // 类型推断：TS 根据初始值自动推断类型，无需手动标注
  const inferred = "auto-typed";  // 推断为 string
  const inferredNum = 42;         // 推断为 number
  console.log(`- explicit: version = ${version} (number)`);
  console.log(`- inferred: "${inferred}" (${typeof inferred}), ${inferredNum} (${typeof inferredNum})`);

  // --- 3. 联合类型（Union Types）---
  // 使用 | 将多个类型组合，变量可以是其中任意一种
  let id: string | number;
  id = 101;
  console.log(`- union: id = ${id} (number)`);
  id = "A-101";
  console.log(`- union: id = ${JSON.stringify(id)} (string)`);

  // --- 4. 字面量类型（Literal Types）---
  // 限制变量为某个具体的值，而非宽泛的类型
  type Direction = "north" | "south" | "east" | "west";
  const dir: Direction = "north";
  console.log(`- literal: direction = ${dir}`);

  // 字面量类型常与联合类型结合，用于表示有限的取值集合
  type HttpStatus = 200 | 404 | 500;
  const status: HttpStatus = 200;
  console.log(`- literal: httpStatus = ${status}`);

  // --- 5. null 与 undefined ---
  // undefined：变量已声明但未赋值
  let notAssigned: string | undefined;
  console.log(`- undefined: notAssigned = ${notAssigned}`);

  // null：显式表示"空值"，需配合联合类型使用
  let maybeNull: string | null = null;
  console.log(`- null: maybeNull = ${maybeNull}`);

  // strictNullChecks 开启后，null/undefined 不能赋给其他类型
  // 必须通过联合类型显式声明：string | null | undefined
  maybeNull = "now has value";
  console.log(`- null: maybeNull reassigned = ${JSON.stringify(maybeNull)}`);
}