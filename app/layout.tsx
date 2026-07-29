import type { Metadata, Viewport } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "浙江人生模拟器 | Zhejiang Life Simulator",
  description: "出生在浙江十一城，从第一份成绩单到最后一次迁移，用选择写下一段浙江人生。",
  metadataBase: new URL("https://zhejiang-life-simulator.vercel.app"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "浙江人生模拟器 | Zhejiang Life Simulator",
    description: "这一世，生在浙江。你会怎么选？",
    type: "website",
    url: "/",
    siteName: "浙江人生模拟器",
    locale: "zh_CN",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "浙江人生模拟器首页",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "浙江人生模拟器 | Zhejiang Life Simulator",
    description: "出生在浙江十一城，用选择写下一段浙江人生。",
    images: ["/og-image.png"],
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
