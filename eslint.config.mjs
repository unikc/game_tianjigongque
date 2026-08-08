import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Cloudflare/vinext 构建产物。原 lint 脚本用 --ignore-pattern 排除，
    // 写进配置后裸跑 `eslint .` 也能得到正确结果。
    "dist/**",
    ".vinext/**",
    // Capacitor 生成的原生工程与其中的 web 构建产物。
    "ios/**",
    // standalone 单文件构建：产物不检查；verify*.cjs 是跑在 Node 里的
    // CommonJS 验证脚本，前端规则（如禁用 require）不适用。
    "standalone/out/**",
    "standalone/verify*.cjs",
  ]),
]);

export default eslintConfig;
