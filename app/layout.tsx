import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "天机宫阙 · 第一日",
  description: "一入宫门深似海，先学会看懂圣意。",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "天机宫阙",
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
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
