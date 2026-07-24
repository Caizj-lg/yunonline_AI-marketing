import Link from "next/link";
import { LogoutButton } from "./logout-button";

export function Sidebar() {
  return <aside className="sidebar"><Link href="/" className="brand"><span className="brand-mark">Y</span><span>云启智联</span></Link><p className="workspace">数据账号</p><nav><Link href="/client" className="side-link"><span>◌</span>总览</Link></nav><div className="side-bottom"><div className="avatar">A</div><div><b>Demo 数据账号</b><small>已登录</small></div><LogoutButton /></div></aside>;
}
