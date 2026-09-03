/**
 * 模板字面量
 *
 * 知识点：
 * 1. 模板字符串基础（插值与多行）
 * 2. 表达式插值
 * 3. 嵌套模板字符串
 * 4. 标签模板（Tagged Templates）
 * 5. TypeScript 模板字面量类型（Template Literal Types）
 */

export const DESCRIPTION = "Learn template strings, expression interpolation, tagged templates, and template literal types.";

export function run(): void {
  console.log("Template Literals");

  // --- 1. 模板字符串础 ---
  // 使用反引号 ` ` 定义字符串，支持内嵌 ${} 插值
  const name = "Node.js";
  const version = 20.17;
  console.log(`- interpolation: I'm using ${name} v${version}`);

  // 多行字符串：模板字符串内的换行会原样保留，无需 \n
  const multiline = `Line 1
Line 2
Line 3`;
  console.log("- multiline:");
  console.log(multiline);

  // --- 2. 表达式插值 ---
  // ${} 内可以放任意 JS 表达式，包括运算、函数调用、三元表达式
  const a = 10;
  const b = 3;
  console.log(`- expression: ${a} + ${b} = ${a + b}`);
  console.log(`- expression: ${a} / ${b} = ${(a / b).toFixed(2)}`);
  console.log(`- expression: ${a} > ${b} ? ${a > b ? "yes" : "no"}`);

  // --- 3. 嵌套模板字符串 ---
  // 模板字符串内部可以嵌套另一个模板字符串
  const items = ["apple", "banana", "cherry"];
  const list = `Fruits: ${items.map((item) => `[${item}]`).join(", ")}`;
  console.log(`- nested: ${list}`);

  // 三元表达式中的嵌套模板
  const isAdmin = true;
  const msg = `Welcome, ${isAdmin ? `admin ${name}` : "guest"}`;
  console.log(`- nested: ${msg}`);

  // --- 4. 标签模板（Tagged Templates）---
  // 标签是一个函数，接收字符串组和插值参数，可自定义处理结果
  // 第一个参数是字符串片段数组（被 ${} 分隔的部分）
  // 后续参数是每个 ${} 表达式的值
  function highlight(strings: TemplateStringsArray, ...values: (string | number)[]): string {
    return strings.reduce((result, str, i) => {
      const value = values[i] !== undefined ? `**${values[i]}**` : "";
      return result + str + value;
    }, "");
  }
  const highlighted = highlight`Learning ${name} version ${version}`;
  console.log(`- tagged: ${highlighted}`);

  // 实际用途：HTML 转义、国际化、SQL 防注入等
  function escapeHtml(strings: TemplateStringsArray, ...values: string[]): string {
    return strings.reduce((result, str, i) => {
      const escaped = values[i]
        ?.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;") ?? "";
      return result + str + escaped;
    }, "");
  }
  const userInput = "<script>alert('xss')</script>";
  const safe = escapeHtml`Comment: ${userInput}`;
  console.log(`- tagged (escape): ${safe}`);

  // --- 5. TypeScript 模板字面量类型 ---
  // TS 4.1+ 支持：用模板字符串语法定义类型，生成字符串面量的联合类型
  type EventName = "on" | "before" | "after";
  type EventType = "click" | "hover" | "focus";
  // 组合成 "onclick" | "onhover" | "onfocus" | "beforeclick" | ...
  type Handler = `${EventName}${Capitalize<EventType>}`;

  // 使用模板字面量类型
  function addListener(event: Handler, callback: () => void): void {
    console.log(`- literal type: registered "${event}"`);
  }
  addListener("onClick", () => {});
  addListener("beforeHover", () => {});
  addListener("afterFocus", () => {});

  // 实际用途：类型安全的属性选择器
  interface Config {
    host: string;
    port: number;
    debug: boolean;
  }
  // 自动生成 "getHost" | "getPort" | "getDebug"
  type Getter<K extends keyof Config> = `get${Capitalize<K>}`;

  function createGetter<K extends keyof Config>(key: K): Getter<K> {
    return `get${key.charAt(0).toUpperCase()}${key.slice(1)}` as Getter<K>;
  }
  console.log(`- literal type: ${createGetter("host")}`);
  console.log(`- literal type: ${createGetter("port")}`);
}