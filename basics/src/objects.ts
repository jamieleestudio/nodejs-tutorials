/**
 * 对象与类型
 *
 * 知识点：
 * 1. 对象字面量与类型注解
 * 2. 可选属性（?）与只读属性（readonly）
 * 3. Record<K, V> 工具类型
 * 4. 对象解构
 * 5. 对象展开（Spread）
 * 6. 计算属性名（Computed Property Names）
 */

export const DESCRIPTION = "Learn object literals, optional/readonly properties, Record, destructuring, spread, and computed properties.";

export function run(): void {
  console.log("Objects");

  // --- 1. 对象字面量与类型注解 ---
  // 使用 interface 或 type 定义对象形状，约束属性名和类型
  interface User {
    name: string;
    age: number;
  }
  const user: User = { name: "Alice", age: 30 };
  console.log(`- literal: ${JSON.stringify(user)}`);

  // --- 2. 可选属性与只读属性 ---
  interface Article {
    readonly id: number;   // readonly：初始化后不可修改
    title: string;
    tags?: string[];        // ? 可选属性：可以不提供
  }
  const article: Article = { id: 1, title: "TS Basics" };
  console.log(`- optional: ${JSON.stringify(article)} (tags is ${article.tags})`);
  // article.id = 2;  // TS 报错：Cannot assign to 'id' because it is a read-only property

  // --- 3. Record<K, V> 工具类型 ---
  // Record<Keys, Value>：创建一个键类型为 K、值类型为 V 的对象类型
  const scores: Record<string, number> = {
    math: 95,
    english: 88,
    science: 92,
  };
  console.log(`- Record: ${JSON.stringify(scores)}`);

  // Record 常用于键为联合类型的场景
  type Role = "admin" | "user" | "guest";
  const permissions: Record<Role, string[]> = {
    admin: ["read", "write", "delete"],
    user: ["read", "write"],
    guest: ["read"],
  };
  console.log(`- Record<Role, ...>: admin has ${JSON.stringify(permissions.admin)}`);

  // --- 4. 对象解构 ---
  // 按属性名提取值到变量
  const { name, age } = user;
  console.log(`- destructure: name=${name}, age=${age}`);

  // 重命名解构：把属性重命名为新变量名
  const { name: firstName, age: userAge } = user;
  console.log(`- rename: firstName=${firstName}, userAge=${userAge}`);

  // 解构时设置默认值：属性为 undefined 时使用默认值
  const { tags = ["default"] } = article;
  console.log(`- default: tags=${JSON.stringify(tags)}`);

  // --- 5. 对象展开（Spread）---
  // 使用 ... 将对象的属性展开到新对象中
  const defaults = { theme: "light", lang: "en" };
  const overrides = { lang: "zh" };
  const settings = { ...defaults, ...overrides };  // 后展开的覆盖先展开的
  console.log(`- spread: ${JSON.stringify(settings)}`);

  // --- 6. 计算属性名 ---
  // 使用 [expression] 在对象字面量中动态设置键名
  const key = "dynamicKey";
  const obj = { [key]: "dynamic value" };
  console.log(`- computed: ${JSON.stringify(obj)}`);

  // 常见用途：根据变量值生成对象键
  const eventType = "click";
  const handlers = {
    [`on${eventType}`]: () => "clicked",
  };
  console.log(`- computed: ${JSON.stringify(handlers)}`);
}