/**
 * 泛型基础
 *
 * 注意：本 demo 讲解泛型函数与泛型接口的基础概念，
 * 泛型类的内容在 oop 模块中讲解。
 *
 * 知识点：
 * 1. 泛型函数（Generic Functions）
 * 2. 泛型接口（Generic Interfaces）
 * 3. 泛型约束（Constraints，extends）
 * 4. 默认泛型参数（Default Type Parameters）
 * 5. 多类型参数（Multiple Type Parameters）
 */

export const DESCRIPTION = "Learn generic functions, generic interfaces, constraints, default type params, and multiple type params.";

/**
 * 泛型函数：T 是类型参数，在调用时由参数推断或显式指定
 * 作用：让函数能处理多种类型，同时保持类型安全
 */
function identity<T>(value: T): T {
  return value;
}

/**
 * 泛型约束：使用 extends 限制 T 必须拥有某些属性
 * 这里要求 T 必须有 length 属性（string、数组等都满足）
 */
function getLength<T extends { length: number }>(item: T): number {
  return item.length;
}

/**
 * 泛型接口：定义可复用的泛型数据结构
 */
interface Box<T> {
  value: T;
}

/**
 * 默认泛型参数：当类型未指定时使用默认类型
 */
interface Repository<T = string> {
  get(id: string): T | undefined;
  save(id: string, value: T): void;
}

/**
 * 多类型参数：一个函数可以接受多个独立的类型参数
 */
function pair<K, V>(key: K, value: V): { key: K; value: V } {
  return { key, value };
}

export function run(): void {
  console.log("Generics");

  // --- 1. 泛型函数 ---
  // 类型推断：TS 根据 42 自动推断 T = number
  const num = identity(42);
  console.log(`- identity: ${num} (${typeof num})`);

  // 类型推断：TS 根据 "hello" 推断 T = string
  const str = identity("hello");
  console.log(`- identity: "${str}" (${typeof str})`);

  // 显式指定类型参数：<string> 明确告诉 TS 这是 string
  const explicit = identity<string>("explicit");
  console.log(`- identity<string>: "${explicit}"`);

  // --- 2. 泛型约束 ---
  // string 有 length 属性，满足约束
  console.log(`- constraint: length("TypeScript") = ${getLength("TypeScript")}`);
  // 数组有 length 属性，也满足约束
  console.log(`- constraint: length([1,2,3]) = ${getLength([1, 2, 3])}`);
  // number 没有 length 属性，不满足约束，TS 会报错：
  // getLength(42);  // Error: Argument of type 'number' is not assignable to parameter of type '{ length: number }'

  // --- 3. 泛型接口 ---
  const stringBox: Box<string> = { value: "gift" };
  const numBox: Box<number> = { value: 100 };
  console.log(`- Box<string>: ${JSON.stringify(stringBox)}`);
  console.log(`- Box<number>: ${JSON.stringify(numBox)}`);

  // --- 4. 默认泛型参数 ---
  // 不指定类型参数时，默认为 string
  const strRepo: Repository = {
    get: (id) => `item-${id}`,
    save: (id, value) => console.log(`- repo save ${id}: ${value}`),
  };
  console.log(`- default repo.get("1") = ${strRepo.get("1")}`);

  // 指定类型参数为 number
  const numRepo: Repository<number> = {
    get: (id) => (id === "1" ? 42 : undefined),
    save: (id, value) => console.log(`- repo save ${id}: ${value}`),
  };
  console.log(`- explicit repo.get("1") = ${numRepo.get("1")}`);

  // --- 5. 多类型参数 ---
  const p1 = pair("id", 101);
  console.log(`- pair: ${JSON.stringify(p1)}`);

  const p2 = pair(1, ["a", "b"]);
  console.log(`- pair: ${JSON.stringify(p2)}`);

  // 实际用途：Map 的键值对类型就是多类型参数
  const map = new Map<string, number>();
  map.set("answer", 42);
  console.log(`- Map<string, number>: answer = ${map.get("answer")}`);
}