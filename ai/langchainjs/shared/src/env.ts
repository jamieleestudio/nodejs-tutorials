import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

/**
 * 从组根（含 pnpm-workspace.yaml 的目录）向上查找 .env 并注入 process.env。
 * 无 dotenv 依赖的极简实现。
 */
function loadRootEnv(): void {
  let dir = process.cwd();
  while (dir.length > 3) {
    const envFile = join(dir, '.env');
    if (existsSync(envFile)) {
      for (const line of readFileSync(envFile, 'utf8').split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eq = trimmed.indexOf('=');
        if (eq <= 0) continue;
        const key = trimmed.slice(0, eq).trim();
        const value = trimmed.slice(eq + 1).trim();
        if (!(key in process.env)) process.env[key] = value;
      }
      return;
    }
    const parent = dirname(dir);
    if (parent === dir) return;
    dir = parent;
  }
}

loadRootEnv();
