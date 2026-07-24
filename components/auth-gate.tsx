"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter(); const [ready, setReady] = useState(false);
  useEffect(() => { if (window.localStorage.getItem("yunqi_demo_login") === "true") setReady(true); else router.replace("/login"); }, [router]);
  if (!ready) return <main className="auth-loading">正在验证 Demo 登录状态…</main>;
  return <>{children}</>;
}
