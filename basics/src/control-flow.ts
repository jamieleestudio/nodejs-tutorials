/**
 * 控制流语句
 *
 * 知识点：
 * 1. if / else if / else 条件分支
 * 2. switch 语句
 * 3. for / for...of / for...in 循环
 * 4. while 循环
 * 5. break 与 continue
 */

export const DESCRIPTION = "Learn if/else, switch, for/for...of/for...in, while, break, and continue.";

export function run(): void {
  console.log("Control Flow");

  // --- 1. if / else if / else ---
  const score: number = 85;
  if (score >= 90) {
    console.log("- grade: A");
  } else if (score >= 80) {
    console.log("- grade: B");
  } else if (score >= 60) {
    console.log("- grade: C");
  } else {
    console.log("- grade: F");
  }

  // 三元表达式：简洁的二选一条件表达式
  const result = score >= 60 ? "Pass" : "Fail";
  console.log(`- ternary: ${result}`);

  // --- 2. switch 语句 ---
  // 适合对单个变量的多个离散值做分支判断
  // 每个 case 必须以 break 结尾，否则会"穿透"到下一个 case
  const day: string = "Wednesday";
  switch (day) {
    case "Monday":
    case "Tuesday":
    case "Wednesday":
    case "Thursday":
    case "Friday":
      console.log(`- switch: ${day} is a weekday`);
      break;
    case "Saturday":
    case "Sunday":
      console.log(`- switch: ${day} is a weekend`);
      break;
    default:
      console.log(`- switch: unknown day "${day}"`);
  }

  // --- 3. for / for...of / for...in ---
  // 经典 for 循环：通过索引遍历
  const nums: number[] = [10, 20, 30];
  let sum = 0;
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
  }
  console.log(`- for: sum = ${sum}`);

  // for...of：遍历可迭代对象的值（数、字符串等）
  for (const num of nums) {
    console.log(`- for...of: ${num}`);
  }

  // for...in：遍历对象的键名（包括原型链上的可枚举属性）
  const obj = { a: 1, b: 2, c: 3 };
  for (const key in obj) {
    console.log(`- for...in: ${key} = ${obj[key as keyof typeof obj]}`);
  }

  // --- 4. while 循环 ---
  // 当条件为 true 时反复执行，适合不确定迭代次数的场景
  let countdown = 3;
  while (countdown > 0) {
    console.log(`- while: ${countdown}`);
    countdown--;
  }

  // do...while：至少执行一次循环体
  let n = 0;
  do {
    console.log(`- do...while: ${n}`);
    n++;
  } while (n < 1);

  // --- 5. break 与 continue ---
  // break：立即跳出当前循环
  for (let i = 0; i < 10; i++) {
    if (i === 3) {
      console.log(`- break at i=${i}`);
      break;
    }
  }

  // continue：跳过本次迭代，进入下一次循环
  for (let i = 0; i < 5; i++) {
    if (i % 2 === 0) {
      continue;  // 跳过偶数
    }
    console.log(`- continue: odd = ${i}`);
  }
}