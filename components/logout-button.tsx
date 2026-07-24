"use client";
import { useRouter } from "next/navigation";
export function LogoutButton() { const router = useRouter(); return <button className="logout" onClick={() => { window.localStorage.removeItem("yunqi_demo_login"); router.replace("/login"); }}>退出登录</button>; }
