import type { Metadata } from "next";
import "./globals.css";
import "./overrides.css";

export const metadata: Metadata = {
  title: "云启智联 · GEO 原始证据分析",
  description: "面向客户的 AI 可见性原始问答证据系统",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
