/**
 * 数组操作
 *
 * 知识点：
 * 1. 数组声明方式（类型注解 + 泛型语法）
 * 2. 常用方法：push/pop/shift/unshift
 * 3. 遍历方法：map/filter/reduce
 * 4. 数组解构
 * 5. 数组展开（Spread）
 * 6. 只读数组（ReadonlyArray / readonly 修饰符）
 */

export const DESCRIPTION = "Learn array declarations, push/pop, map/filter/reduce, destructuring, spread, and readonly arrays.";

export function run(): void {
  console.log("Arrays");

  // --- 1. 数组声明方式 ---
  // 方式一：类型注解 + 方括号语法（推荐）
  const nums: number[] = [1, 2, 3];
  // 方式二：泛型数组语法
  const names: Array<string> = ["Alice", "Bob"];
  console.log(`- declare: nums = ${JSON.stringify(nums)}`);
  console.log(`- declare: names = ${JSON.stringify(names)}`);

  // --- 2. 常用方法 ---
  const stack: number[] = [];
  stack.push(1);  // 尾部添加
  stack.push(2);
  stack.push(3);
  console.log(`- push: ${JSON.stringify(stack)}`);
  const popped = stack.pop();  // 尾部移除并返回
  console.log(`- pop: removed ${popped}, remaining = ${JSON.stringify(stack)}`);
  stack.unshift(0);  // 头部添加
  console.log(`- unshift: ${JSON.stringify(stack)}`);
  stack.shift();      // 头部移除并返回
  console.log(`- shift: ${JSON.stringify(stack)}`);

  // --- 3. map / filter / reduce ---
  const original = [1, 2, 3, 4, 5];

  // map：对每个元素应用函数，返回新数组
  const doubled = original.map((n) => n * 2);
  console.log(`- map: ${JSON.stringify(original)} -> ${JSON.stringify(doubled)}`);

  // filter：保留满足条件的元素，返回新数组
  const evens = original.filter((n) => n % 2 === 0);
  console.log(`- filter: ${JSON.stringify(original)} -> ${JSON.stringify(evens)}`);

  // reduce：将数组归约为单个值
  const total = original.reduce((acc, n) => acc + n, 0);
  console.log(`- reduce: sum of ${JSON.stringify(original)} = ${total}`);

  // --- 4. 数组解构 ---
  // 按位置提取数组元素到变量
  const [first, second, ...rest] = [10, 20, 30, 40, 50];
  console.log(`- destructure: first=${first}, second=${second}, rest=${JSON.stringify(rest)}`);

  // 跳过元素
  const [, , third] = [10, 20, 30];
  console.log(`- destructure (skip): third=${third}`);

  // --- 5. 数组展开（Spread）---
  // 使用 ... 将数组的元素展开到新数组中
  const a = [1, 2];
  const b = [3, 4];
  const merged = [...a, ...b];
  console.log(`- spread: [...a, ...b] = ${JSON.stringify(merged)}`);

  // 展开可用于创建数组副本（浅拷贝）
  const copy = [...original];
  console.log(`- spread (copy): ${JSON.stringify(copy)}`);

  // --- 6. 只读数组 ---
  // readonly 修饰符：声明后不可修改（push/pop 等方法不可用）
  const frozen: readonly number[] = [100, 200];
  // frozen.push(300);  // TS 报错：Property 'push' does not exist on type 'readonly number[]'
  console.log(`- readonly: ${JSON.stringify(frozen)} (cannot be modified)`);

  // ReadonlyArray<T> 泛型写，等价于 readonly T[]
  const alsoFrozen: ReadonlyArray<string> = ["x", "y", "z"];
  console.log(`- ReadonlyArray: ${JSON.stringify(alsoFrozen)}`);
}