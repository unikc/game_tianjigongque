import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  // 反写域名，需与 Apple Developer 后台注册的 Bundle ID 完全一致。
  // 上架前改成你自己的域名反写，例如 com.yourstudio.tianjipalace。
  appId: "com.tianjipalace.app",
  appName: "天机宫阙",
  // Next.js `output: "export"` 的产物目录
  webDir: "out",
  ios: {
    // 允许内容延伸到刘海/灵动岛区域，配合 CSS env(safe-area-inset-*) 使用。
    contentInset: "never",
    // 关闭橡皮筋回弹，避免文字叙事页面被下拉出灰边，更像原生 App。
    scrollEnabled: true,
    backgroundColor: "#173532",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      backgroundColor: "#173532",
      showSpinner: false,
      // 深色启动屏配合玉色主题，避免白屏闪烁（苹果审核关注启动体验）
      iosSpinnerStyle: "small",
    },
    StatusBar: {
      style: "DARK", // 深色背景配浅色文字
      backgroundColor: "#173532",
      overlaysWebView: true,
    },
  },
};

export default config;
