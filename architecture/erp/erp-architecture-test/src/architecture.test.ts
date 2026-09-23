/**
 * 架构守护测试 —— Node 版 ArchUnit
 *
 * 用 java ArchUnit 的思路守护 COLA 分层的依赖规则：
 * 通过扫描源码的 import 语句，断言层与层之间的依赖方向。
 *
 * 规则：
 * 1. shared-kernel：零依赖（不 import 任何 @erp/* 或 @nestjs/*）
 * 2. platform：只能依赖 shared-kernel（禁止 module / app / cqrs）
 * 3. module 的 domain 目录：纯领域（禁止 @nestjs/*、platform、prisma）
 * 4. module：禁止依赖 app
 * 5. app：只允许依赖 module + platform + 框架核心
 */

import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ERP_ROOT = join(import.meta.dirname, "..", "..");

function collectTsFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true, recursive: true })) {
    if (entry.isFile() && entry.name.endsWith(".ts")) {
      out.push(join(entry.parentPath ?? entry.path, entry.name));
    }
  }
  return out;
}

function importsOf(file: string): string[] {
  const src = readFileSync(file, "utf8");
  const specifiers: string[] = [];
  const re = /(?:from|import)\s+["']([^"']+)["']/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) specifiers.push(m[1]!);
  return specifiers.filter((s) => !s.startsWith(".") && !s.startsWith("/"));
}

function violations(pkg: string, predicate: (spec: string) => boolean): string[] {
  const files = collectTsFiles(join(ERP_ROOT, pkg, "src"));
  const bad: string[] = [];
  for (const file of files) {
    for (const spec of importsOf(file)) {
      if (predicate(spec)) {
        bad.push(`${file.replace(ERP_ROOT, "")} → ${spec}`);
      }
    }
  }
  return bad;
}

describe("ERP layered architecture (COLA) — dependency rules", () => {
  it("1. shared-kernel depends on NOTHING (framework-free)", () => {
    const bad = violations("erp-shared-kernel", (s) =>
      s.startsWith("@nestjs") || s.startsWith("@erp/"),
    );
    expect(bad).toEqual([]);
  });

  it("2. platform may only depend on shared-kernel (+ framework core)", () => {
    const forbidden = ["@erp/module", "@erp/app", "@nestjs/cqrs"];
    const bad = violations("erp-platform", (s) => forbidden.includes(s));
    expect(bad).toEqual([]);
  });

  it("3. module/domain stays pure: no @nestjs, no platform, no prisma", () => {
    const files = collectTsFiles(join(ERP_ROOT, "erp-module", "src"))
      .filter((f) => /[\\/]domain[\\/]/.test(f));
    const bad: string[] = [];
    for (const file of files) {
      for (const spec of importsOf(file)) {
        if (spec.startsWith("@nestjs") || spec.startsWith("@erp/platform") || spec.includes("generated/prisma")) {
          bad.push(`${file.replace(ERP_ROOT, "")} → ${spec}`);
        }
      }
    }
    expect(bad).toEqual([]);
  });

  it("4. module must NOT depend on app", () => {
    const bad = violations("erp-module", (s) => s.startsWith("@erp/app"));
    expect(bad).toEqual([]);
  });

  it("5. app may only import module + platform + framework core", () => {
    const allowed = ["@erp/module", "@erp/platform", "@nestjs/common", "@nestjs/core", "reflect-metadata", "class-validator", "class-transformer"];
    const bad = violations("erp-app", (s) => !allowed.includes(s) && !s.startsWith("node:"));
    expect(bad).toEqual([]);
  });
});
