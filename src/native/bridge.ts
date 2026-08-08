/**
 * 原生能力桥接层。
 *
 * 存在的两个理由：
 * 1. 体验：文字叙事游戏在手机上最缺的就是"手感"，触感反馈能显著提升做选择时的分量感。
 * 2. 上架：App Store 审核指南 4.2（Minimum Functionality）会拒绝纯 WebView 套壳。
 *    真实调用原生 API（触感、状态栏、生命周期、分享）是证明"这是一个 App 而非网页"
 *    的必要条件之一。
 *
 * 设计原则：所有调用在非原生环境（浏览器 dev / 桌面端）静默降级为 no-op，
 * 这样 `pnpm dev` 在电脑上跑不会报错，同一套代码两端通用。
 */

import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import { App } from "@capacitor/app";

export const isNative = (): boolean => Capacitor.isNativePlatform();

/** 触感反馈：按选项分量给不同强度，让"重大抉择"在指尖有区别。 */
export const haptics = {
  /** 普通选项点击 */
  async light() {
    if (!isNative()) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch {
      /* 触感不可用时静默忽略，不能因为震动失败中断游戏 */
    }
  },
  /** 需要确认的重要抉择（如御前裁定、交出证据） */
  async medium() {
    if (!isNative()) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch {
      /* noop */
    }
  },
  /** 章节结算、晋位、结局等里程碑时刻 */
  async success() {
    if (!isNative()) return;
    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch {
      /* noop */
    }
  },
  /** 失去关系、被降位、证据损毁等负面后果 */
  async warning() {
    if (!isNative()) return;
    try {
      await Haptics.notification({ type: NotificationType.Warning });
    } catch {
      /* noop */
    }
  },
};

/** 状态栏：深色玉底配浅色文字，与游戏主题一致 */
export async function configureStatusBar(): Promise<void> {
  if (!isNative()) return;
  try {
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setOverlaysWebView({ overlay: true });
  } catch {
    /* noop */
  }
}

/** 启动屏：等首屏内容真正就绪后再隐藏，避免白屏闪一下 */
export async function hideSplash(): Promise<void> {
  if (!isNative()) return;
  try {
    await SplashScreen.hide();
  } catch {
    /* noop */
  }
}

/**
 * 应用生命周期：切到后台时立刻存档。
 *
 * 这一条对叙事游戏很关键——玩家随时会被电话/消息打断，iOS 可能在后台
 * 直接回收进程。不在 pause 时存档，玩家回来会发现进度丢了，这是差评重灾区。
 *
 * @param onPause 切后台时的回调，应在此写入存档
 * @returns 取消监听的函数，供 React useEffect 清理
 */
export function onAppPause(onPause: () => void): () => void {
  if (!isNative()) return () => {};
  const handlePromise = App.addListener("appStateChange", ({ isActive }) => {
    if (!isActive) onPause();
  });
  return () => {
    void handlePromise.then((handle) => handle.remove());
  };
}

/**
 * iOS 没有硬件返回键，但有从屏幕左缘右滑的返回手势。
 * Capacitor 会把它映射为 backButton 事件。这里拦截它，交给游戏自己处理
 * （比如"返回上一屏"而不是直接退出 App）。
 */
export function onBackGesture(handler: () => void): () => void {
  if (!isNative()) return () => {};
  const handlePromise = App.addListener("backButton", () => handler());
  return () => {
    void handlePromise.then((handle) => handle.remove());
  };
}

/** 一次性初始化，在根组件挂载时调用 */
export async function initNativeShell(): Promise<void> {
  if (!isNative()) return;
  await configureStatusBar();
}
