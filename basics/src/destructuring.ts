/**
 * 解构赋值
 *
 * 知识点：
 * 1. 数组解构
 * 2. 对象解构
 * 3. 默认值
 * 4. 重命名
 * 5. 嵌套解构
 * 6. 函数参数解构
 */

export const DESCRIPTION = "Learn array/object destructuring, defaults, renaming, nested destructuring, and function parameter destructuring.";

export function run(): void {
  console.log("Destructuring");

  // --- 1. 数组解构 ---
  // 按位置（索引）提取数组元素到变量
  const rgb = [255, 128, 0];
  const [red, green, blue] = rgb;
  console.log(`- array: red=${red}, green=${green}, blue=${blue}`);

  // 跳过不需要的元素
  const [, , onlyBlue] = rgb;
  console.log(`- array (skip): onlyBlue=${onlyBlue}`);

  // --- 2. 对象解构 ---
  // 按属性名提取值到同名变量
  const user = { name: "Alice", age: 30, city: "Beijing" };
  const { name, age, city } = user;
  console.log(`- object: name=${name}, age=${age}, city=${city}`);

  // --- 3. 默认值 ---
  // 数组解构默认值：当对应位置为 undefined 时使用
  const [a = 1, b = 2, c = 3] = [10, undefined];
  console.log(`- array default: a=${a}, b=${b}, c=${c}`);

  // 对象解构默认值：当属性为 undefined 时使用
  const { name: n = "Anonymous", score = 0 } = { name: "Bob" };
  console.log(`- object default: n=${n}, score=${score}`);

  // --- 4. 重命名 ---
  // 语法：propertyName: newName
  // 将 user.name 重命名为 userName
  const { name: userName, age: userAge } = user;
  console.log(`- rename: userName=${userName}, userAge=${userAge}`);

  // 重命名 + 默认值组合使用
  const { age: years = 18 } = { name: "Charlie" } as { name: string; age?: number };
  console.log(`- rename+default: years=${years}`);

  // --- 5. 嵌套解构 ---
  // 解构多层嵌套的对象/数
  const data = {
    user: {
      profile: {
        firstName: "Dave",
        lastName: "Smith",
      },
      scores: [95, 88, 92],
    },
  };

  // 直接解构到嵌套层级
  const {
    user: {
      profile: { firstName, lastName },
      scores: [first, , last],
    },
  } = data;
  console.log(`- nested: ${firstName} ${lastName}, scores: first=${first}, last=${last}`);

  // --- 6. 函数参数解构 ---
  // 直接在参数列表中解构对象，使函数调用更简洁
  interface Point { x: number; y: number }
  function distance({ x, y }: Point): number {
    return Math.sqrt(x * x + y * y);
  }
  const dist = distance({ x: 3, y: 4 });
  console.log(`- function param: distance(3, 4) = ${dist}`);

  // 参数解构 + 默认值 + 重命名
  function greet({ name = "Guest", greeting = "Hello" }: {
    name?: string;
    greeting?: string;
  }): string {
    return `${greeting}, ${name}!`;
  }
  console.log(`- function param: ${greet({})}`);
  console.log(`- function param: ${greet({ name: "Eve" })}`);
  console.log(`- function param: ${greet({ name: "Frank", greeting: "Hi" })}`);

  // 参数解构配合剩余参数
  function processUser({ name, ...rest }: { name: string; age?: number; role?: string }) {
    console.log(`- rest in destruct: name=${name}, rest=${JSON.stringify(rest)}`);
  }
  processUser({ name: "Grace", age: 25, role: "admin" });
}