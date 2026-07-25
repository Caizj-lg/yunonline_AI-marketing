"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClientIndex() {
  const router = useRouter();
  useEffect(() => { router.replace("/client/overview"); }, [router]);
  return <main className="auth-loading">正在进入成效总览…</main>;
}
