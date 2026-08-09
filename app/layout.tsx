import type { Metadata, Viewport } from "next";
import ServiceWorkerRegistrar from "@/src/components/ServiceWorkerRegistrar";
import "./globals.css";

export const metadata: Metadata = {
  title: "天机宫阙 · 第一日",
  description: "一入宫门深似海，先学会看懂圣意。",
  // PWA：让 Safari「添加到主屏幕」后以独立 App 形式全屏运行
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "天机宫阙",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    // iOS 主屏幕图标不读 manifest，必须单独声明这一条
    apple: "/apple-touch-icon.png",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#173532", // Mirrors --ids-color-jade; metadata cannot consume CSS variables.
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=localStorage.getItem("tianji-palace-theme")||"system";var d=m==="night"||(m==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.gameTheme=d?"night":"day";document.documentElement.style.colorScheme=d?"dark":"light"}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        {children}
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
