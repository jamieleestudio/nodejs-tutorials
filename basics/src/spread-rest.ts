/**
 * 展开语法与剩余参数
 *
 * 知识点：
 * 1. 数组展开（Spread）
 * 2. 对象展开
 * 3. 剩余参数（Rest Parameters）
 * 4. 剩余元素（Rest Elements in destructuring）
 * 5. 展开在函数调用中的应用
 */

export const DESCRIPTION = "Learn array/object spread, rest parameters, rest elements, and spread in function calls.";

export function run(): void {
  console.log("Spread & Rest");

  // --- 1. 数组展开 ---
  // 使用 ... 将数组的元素逐个展开到新数组中
  const a = [1, 2];
  const b = [3, 4];
  const merged = [...a, ...b];
  console.log(`- array spread: ${JSON.stringify(merged)}`);

  // 在中间插入元素
  const inserted = [...a, 99, ...b];
  console.log(`- array spread (insert): ${JSON.stringify(inserted)}`);

  // 创建数组副本（浅拷贝）
  const original = [1, 2, 3];
  const copy = [...original];
  console.log(`- array copy: ${JSON.stringify(copy)} (shallow copy)`);

  // --- 2. 对象展开 ---
  // 使用 ... 将对象的属性展开到新对象中
  // 后展开的同名属性会覆盖先展开的
  const defaults = { host: "localhost", port: 3000, debug: false };
  const overrides = { port: 8080, debug: true };
  const config = { ...defaults, ...overrides };
  console.log(`- object spread: ${JSON.stringify(config)}`);

  // 添加新属性的同时展开已有对象
  const base = { x: 1, y: 2 };
  const extended = { ...base, z: 3 };
  console.log(`- object spread (extend): ${JSON.stringify(extended)}`);

  // --- 3. 剩余参数（Rest Parameters）---
  // 在函数定义中，... 收集多个参数为一个数组
  function sum(...nums: number[]): number {
    return nums.reduce((acc, n) => acc + n, 0);
  }
  console.log(`- rest params: sum(1, 2, 3) = ${sum(1, 2, 3)}`);
  console.log(`- rest params: sum(1, 2, 3, 4, 5) = ${sum(1, 2, 3, 4, 5)}`);

  // 剩余参数配合固定参数
  function logWithTag(tag: string, ...messages: string[]): void {
    const combined = messages.map((m) => `[${tag}] ${m}`).join(", ");
    console.log(`- rest + fixed: ${combined}`);
  }
  logWithTag("INFO", "started", "running", "done");

  // --- 4. 剩余元素（Rest Elements in destructuring）---
  // 在解构中，... 收集剩余的元素/属性为数组/对象
  const [first, ...remaining] = [10, 20, 30, 40];
  console.log(`- rest in array: first=${first}, remaining=${JSON.stringify(remaining)}`);

  const { name, ...others } = { name: "Alice", age: 30, city: "Beijing" };
  console.log(`- rest in object: name=${name}, others=${JSON.stringify(others)}`);

  // --- 5. 展开在函数调用中的应用 ---
  // 使用 ... 将数组展开为函数的独立参数
  function add(a: number, b: number, c: number): number {
    return a + b + c;
  }
  const args: [number, number, number] = [1, 2, 3];
  // 等价于 add(1, 2, 3)
  const result = add(...args);
  console.log(`- spread in call: add(...[1,2,3]) = ${result}`);

  // 与 Math.max 等内置函数配合
  const values = [5, 3, 9, 1, 7];
  const max = Math.max(...values);
  console.log(`- spread in call: Math.max(...${JSON.stringify(values)}) = ${max}`);

  // --- 实际应用场景 ---
  // 合并配置对象
  const defaultOptions = { method: "GET", timeout: 5000, retries: 3 };
  const userOptions = { method: "POST", timeout: 10000 };
  const finalOptions = { ...defaultOptions, ...userOptions };
  console.log(`- real world: ${JSON.stringify(finalOptions)}`);
}