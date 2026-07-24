"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { isDemoCredential } from "@/lib/demo-credentials";

export function LoginForm() {
  const router = useRouter(); const [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!isDemoCredential(String(data.get("username") || ""), String(data.get("password") || ""))) { setError("账号或密码错误，请重试。"); return; }
    window.localStorage.setItem("yunqi_demo_login", "true");
    router.replace("/client");
  }
  return <form className="login-form" onSubmit={submit}><label>账号<input name="username" autoComplete="username" required /></label><label>密码<input name="password" type="password" autoComplete="current-password" required /></label>{error && <p className="error">账号或密码错误，请重试。</p>}<button className="dark-button" type="submit">登录查看数据</button></form>;
}
