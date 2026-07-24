"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter(); const [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get("username") !== "admin" || data.get("password") !== "admin123") { setError("账号或密码错误，请重试。"); return; }
    window.localStorage.setItem("yunqi_demo_login", "true");
    router.replace("/client");
  }
  return <form className="login-form" onSubmit={submit}><label>账号<input name="username" autoComplete="username" defaultValue="admin" required /></label><label>密码<input name="password" type="password" autoComplete="current-password" defaultValue="admin123" required /></label>{error && <p className="error">{error}</p>}<button className="dark-button" type="submit">登录查看数据</button><p className="demo-hint">Demo 账号：admin　密码：admin123</p></form>;
}
