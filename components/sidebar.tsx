"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "./logout-button";

const navigation = [
  ["/client/overview", "◌", "成效总览"],
  ["/client/trends", "⌁", "批次趋势"],
  ["/client/platforms", "◉", "平台表现"],
  ["/client/competition", "◇", "品牌竞争"],
  ["/client/evidence", "▤", "原始证据"],
] as const;

export function Sidebar() {
  const pathname = usePathname();
  return <aside className="sidebar"><Link href="/" className="brand"><span className="brand-mark">Y</span><span>云启智联</span></Link><p className="workspace">数据账号</p><nav>{navigation.map(([href, icon, label]) => <Link href={href} key={href} className={`side-link ${pathname === href || (href === "/client/evidence" && pathname.startsWith("/client/evidence/")) ? "active" : ""}`}><span>{icon}</span>{label}</Link>)}</nav><div className="side-bottom"><div className="avatar">A</div><div><b>Demo 数据账号</b><small>已登录</small></div><LogoutButton /></div></aside>;
}
