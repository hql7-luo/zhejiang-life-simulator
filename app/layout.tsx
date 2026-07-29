import type { Metadata, Viewport } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "浙江人生模拟器 | Zhejiang Life Simulator",
  description: "出生在浙江十一城，从第一份成绩单到最后一次迁移，用选择写下一段浙江人生。",
  metadataBase: new URL("https://zhejiang-life-simulator.vercel.app"),
  openGraph: {
    title: "浙江人生模拟器",
    description: "这一世，生在浙江。你会怎么选？",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1b2a35",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
