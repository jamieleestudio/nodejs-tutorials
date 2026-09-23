/** 环境配置读取（12-Factor: III. Config） */
export function envConfig<T extends Record<string, string>>(spec: T): Record<keyof T, string> {
  const out = {} as Record<keyof T, string>;
  for (const key of Object.keys(spec) as Array<keyof T & string>) {
    out[key] = process.env[key] ?? spec[key];
  }
  return out;
}
