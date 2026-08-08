// 浏览器里没有 process，Next/React 的若干分支会去探测它。
// 提供一个最小垫片，避免打包产物在纯静态页面中抛 "process is not defined"。
const shimProcess = {
  env: { NODE_ENV: "production" },
  emit() {},
  platform: "browser",
};
export { shimProcess as process };
