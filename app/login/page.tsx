import Link from "next/link";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return <main className="login-page"><Link href="/" className="brand"><span className="brand-mark">Y</span><span>云启智联</span></Link><section className="login-card"><p className="eyebrow">数据账号登录</p><h1>查看 AI 问答原始记录</h1><p className="muted">登录后可筛选并核验本次采集的完整 AI 平台回答。</p><LoginForm /></section></main>;
}
