/**
 * 函数声明与类型
 *
 * 知识点：
 * 1. 函数声明 vs 箭头函数
 * 2. 可选参数与默认参数
 * 3. 剩余参数（Rest Parameters）
 * 4. 函数类型（Function Type）
 * 5. 函数重载（Overloads）
 */

export const DESCRIPTION = "Learn function declarations, arrow functions, optional/default/rest params, function types, and overloads.";

export function run(): void {
  console.log("Functions");

  // --- 1. 函数声明 vs 箭头函数 ---
  // 函数声明：有函数提升，可在声明之前调用
  function add(a: number, b: number): number {
    return a + b;
  }
  console.log(`- declaration: add(2, 3) = ${add(2, 3)}`);

  // 箭头函数：无函数提升，this 继承外层作用域，适合回调
  const multiply = (a: number, b: number): number => a * b;
  console.log(`- arrow: multiply(2, 3) = ${multiply(2, 3)}`);

  // --- 2. 可选参数与默认参数 ---
  // 可选参数：用 ? 标记，必须放在必填参数之后
  function greet(name: string, title?: string): string {
    return title ? `Hello, ${title} ${name}` : `Hello, ${name}`;
  }
  console.log(`- optional: ${greet("Alice")}`);
  console.log(`- optional: ${greet("Alice", "Dr.")}`);

  // 默认参数：未传参时使用默认值，效果类似可选参数
  function greetWithDefault(name: string, greeting: string = "Hi"): string {
    return `${greeting}, ${name}`;
  }
  console.log(`- default: ${greetWithDefault("Bob")}`);
  console.log(`- default: ${greetWithDefault("Bob", "Hey")}`);

  // --- 3. 剩余参数（Rest Parameters）---
  // 使用 ... 收集多个参数为一个数组，必须是最后一个参数
  function sumAll(...nums: number[]): number {
    return nums.reduce((acc, n) => acc + n, 0);
  }
  console.log(`- rest: sumAll(1, 2, 3, 4) = ${sumAll(1, 2, 3, 4)}`);

  // --- 4. 函数类型（Function Type）---
  // 用类型别名或 interface 定义函数的签名（参数+返回值）
  type MathOp = (a: number, b: number) => number;
  const subtract: MathOp = (a, b) => a - b;
  const divide: MathOp = (a, b) => a / b;
  console.log(`- function type: subtract(10, 3) = ${subtract(10, 3)}`);
  console.log(`- function type: divide(10, 2) = ${divide(10, 2)}`);

  // --- 5. 函数重载（Overloads）---
  // 为同一个函数提供多个类型签名，根据参数类型返回不同结果
  // 实现签名（最后一个签名）对调用方不可见
  function format(input: number): string;
  function format(input: string): string;
  function format(input: number | string): string {
    return typeof input === "number" ? `#${input}` : `[${input}]`;
  }
  console.log(`- overload: format(42) = ${format(42)}`);
  console.log(`- overload: format("hello") = ${format("hello")}`);
}