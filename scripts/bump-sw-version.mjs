/**
 * 每次 deploy 前自动把 SW 的 CACHE_VERSION 更新为当前时间戳。
 * 这样旧缓存一定会被清掉，手机联网时打开就是最新版。
 */
import { readFileSync, writeFileSync } from "fs";

const path = "public/sw.js";
const src = readFileSync(path, "utf8");
const version = `tianji-v${Date.now()}`;
const updated = src.replace(
  /const CACHE_VERSION = "tianji-v\d+";/,
  `const CACHE_VERSION = "${version}";`,
);
writeFileSync(path, updated);
console.log(`✓ SW cache version → ${version}`);
