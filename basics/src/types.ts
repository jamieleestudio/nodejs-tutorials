/**
 * TypeScript 类型系统基础
 *
 * 知识点：
 * 1. interface vs type 别名
 * 2. 交叉类型（Intersection Types）
 * 3. 联合类型（Union Types）与类型守卫
 * 4. typeof 类型守卫
 * 5. keyof 操作符
 * 6. 索引签名（Index Signatures）
 */

export const DESCRIPTION = "Learn interface vs type, intersection types, union types, typeof, keyof, and index signatures.";

export function run(): void {
  console.log("Types");

  // --- 1. interface vs type 别名 ---
  // interface：用于描述对象形状，支持声明合并（同名 interface 会自动合并）
  interface Point {
    x: number;
    y: number;
  }
  // type 别名：可以描述任意类型（对象、联合、原始类型等）
  type Vector = { x: number; y: number };
  const p: Point = { x: 1, y: 2 };
  const v: Vector = { x: 1, y: 2 };
  console.log(`- interface: ${JSON.stringify(p)}`);
  console.log(`- type alias: ${JSON.stringify(v)}`);

  // --- 2. 交叉类型（Intersection Types）---
  // 使用 & 将多个类型合并为一个类型，新类型拥有所有类型的全部属性
  interface WithName { name: string }
  interface WithAge { age: number }
  type Person = WithName & WithAge;  // Person 同时拥有 name 和 age
  const person: Person = { name: "Alice", age: 30 };
  console.log(`- intersection: ${JSON.stringify(person)}`);

  // --- 3. 联合类型与类型守卫 ---
  // 联合类型：变量可以是多种类型之一（|）
  type StringOrNumber = string | number;
  function printValue(value: StringOrNumber): void {
    // 类型守卫：在代码运行时缩小类型范围
    if (typeof value === "string") {
      console.log(`- union (string): "${value}", length=${value.length}`);
    } else {
      console.log(`- union (number): ${value}, doubled=${value * 2}`);
    }
  }
  printValue("hello");
  printValue(42);

  // --- 4. typeof 类型守卫 ---
  // typeof 在条件分支中收窄类型，使 TS 能区分联合类型的成员
  function process(input: string | number | boolean): string {
    if (typeof input === "boolean") {
      return `boolean: ${input}`;
    } else if (typeof input === "string") {
      return `string: ${input.toUpperCase()}`;
    } else {
      return `number: ${input.toFixed(2)}`;
    }
  }
  console.log(`- typeof guard: ${process(true)}`);
  console.log(`- typeof guard: ${process("abc")}`);
  console.log(`- typeof guard: ${process(3.14159)}`);

  // --- 5. keyof 操作符 ---
  // keyof 获取某个类型的所有键名的联合类型
  interface Config {
    host: string;
    port: number;
    debug: boolean;
  }
  type ConfigKey = keyof Config;  // "host" | "port" | "debug"

  // 常用于创建类型安全的属性访问函数
  function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
  }
  const config: Config = { host: "localhost", port: 3000, debug: true };
  console.log(`- keyof: host = ${getProperty(config, "host")}`);
  console.log(`- keyof: port = ${getProperty(config, "port")}`);

  // --- 6. 索引签名 ---
  // 当对象键名不确定时，用 [key: type]: Type 声明任意键的值类型
  interface StringDictionary {
    [key: string]: string;  // 所有键的值必须为 string
  }
  const dict: StringDictionary = {
    name: "Alice",
    city: "Beijing",
    greeting: "Hello",
  };
  console.log(`- index signature: ${JSON.stringify(dict)}`);

  // 索引签名可以与已知属性共存，但已知属性的值类型必须兼容索引签名的类型
  interface Employee {
    [key: string]: string | number;  // 任意键的值为 string 或 number
    name: string;      // 兼容 string
    age: number;       // 兼容 number
  }
  const emp: Employee = { name: "Bob", age: 25, department: "Engineering" };
  console.log(`- index signature: ${JSON.stringify(emp)}`);
}