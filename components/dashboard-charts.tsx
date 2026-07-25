"use client";

import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const green = "#08946d"; const mint = "#54b99a"; const gold = "#b2873b"; const slate = "#6d7a86";
const tooltip = { contentStyle: { borderRadius: 10, border: "1px solid #dfe8e3", fontSize: 12 }, cursor: { fill: "#f3faf6" } };

function ChartFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return <article className="chart-card"><h3>{title}</h3><div className="chart-canvas">{children}</div></article>;
}

export function PlatformRatesChart({ data, onPlatformClick }: { data: Array<{ platform: string; mentionRate: number | null; topThreeRate: number | null; advantageRate: number | null }>; onPlatformClick?: (platform: string) => void }) {
  const clickPlatform = (entry: { payload?: { platform?: string } }) => { if (entry.payload?.platform) onPlatformClick?.(entry.payload.platform); };
  return <ChartFrame title="各平台核心比例对比"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{ top: 12, right: 8, left: -15, bottom: 0 }}><CartesianGrid vertical={false} stroke="#edf0ef" /><XAxis dataKey="platform" tick={{ fill: slate, fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis tickFormatter={(value) => `${value}%`} domain={[0, 100]} tick={{ fill: slate, fontSize: 10 }} axisLine={false} tickLine={false} /><Tooltip {...tooltip} formatter={(value) => value == null ? "—" : `${Number(value).toFixed(1)}%`} /><Legend wrapperStyle={{ fontSize: 11 }} /><Bar dataKey="mentionRate" name="提及率" fill={green} radius={[5, 5, 0, 0]} onClick={clickPlatform} /><Bar dataKey="topThreeRate" name="前三率" fill={mint} radius={[5, 5, 0, 0]} onClick={clickPlatform} /><Bar dataKey="advantageRate" name="优势率" fill={gold} radius={[5, 5, 0, 0]} onClick={clickPlatform} /></BarChart></ResponsiveContainer></ChartFrame>;
}

export function BrandMentionChart({ data, onBrandClick }: { data: Array<{ name: string; mentionCount: number }>; onBrandClick?: (brand: string) => void }) {
  const clickBrand = (entry: { payload?: { name?: string } }) => { if (entry.payload?.name) onBrandClick?.(entry.payload.name); };
  return <ChartFrame title="品牌提及次数排名"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.slice(0, 8)} layout="vertical" margin={{ top: 4, right: 20, left: 15, bottom: 0 }}><CartesianGrid horizontal={false} stroke="#edf0ef" /><XAxis type="number" tick={{ fill: slate, fontSize: 10 }} axisLine={false} tickLine={false} /><YAxis type="category" dataKey="name" width={88} tick={{ fill: "#44515c", fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip {...tooltip} formatter={(value) => value == null ? "—" : `${value} 次`} /><Bar dataKey="mentionCount" name="提及次数" fill={green} radius={[0, 5, 5, 0]} onClick={clickBrand} /></BarChart></ResponsiveContainer></ChartFrame>;
}

export function BatchVolumeChart({ data }: { data: Array<{ name: string; recordCount: number; questionCount: number; platformCount: number }> }) {
  return <ChartFrame title="批次覆盖规模"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{ top: 12, right: 8, left: -15, bottom: 0 }}><CartesianGrid vertical={false} stroke="#edf0ef" /><XAxis dataKey="name" tick={{ fill: slate, fontSize: 10 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: slate, fontSize: 10 }} axisLine={false} tickLine={false} /><Tooltip {...tooltip} /><Legend wrapperStyle={{ fontSize: 11 }} /><Bar dataKey="recordCount" name="记录数" fill={green} radius={[5, 5, 0, 0]} /><Bar dataKey="questionCount" name="问题数" fill={mint} radius={[5, 5, 0, 0]} /><Bar dataKey="platformCount" name="平台数" fill={gold} radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></ChartFrame>;
}

export function BatchRatesChart({ data }: { data: Array<{ name: string; mentionRate: number | null; topThreeRate: number | null; advantageRate: number | null; firstMentionRate: number | null }> }) {
  if (data.length < 2) return <ChartFrame title="批次核心指标趋势"><div className="chart-empty">当前仅有一个真实批次，新增复查数据后将自动绘制真实变化曲线。</div></ChartFrame>;
  return <ChartFrame title="批次核心指标趋势"><ResponsiveContainer width="100%" height="100%"><LineChart data={data} margin={{ top: 12, right: 8, left: -15, bottom: 0 }}><CartesianGrid vertical={false} stroke="#edf0ef" /><XAxis dataKey="name" tick={{ fill: slate, fontSize: 10 }} axisLine={false} tickLine={false} /><YAxis tickFormatter={(value) => `${value}%`} domain={[0, 100]} tick={{ fill: slate, fontSize: 10 }} axisLine={false} tickLine={false} /><Tooltip {...tooltip} formatter={(value) => value == null ? "—" : `${Number(value).toFixed(1)}%`} /><Legend wrapperStyle={{ fontSize: 11 }} /><Line type="monotone" dataKey="mentionRate" name="提及率" stroke={green} strokeWidth={3} dot={{ r: 4 }} /><Line type="monotone" dataKey="topThreeRate" name="前三率" stroke={mint} strokeWidth={3} dot={{ r: 4 }} /><Line type="monotone" dataKey="advantageRate" name="优势率" stroke={gold} strokeWidth={3} dot={{ r: 4 }} /><Line type="monotone" dataKey="firstMentionRate" name="首位率" stroke="#537a70" strokeWidth={3} dot={{ r: 4 }} /></LineChart></ResponsiveContainer></ChartFrame>;
}

export function BrandPositionChart({ data, onBrandClick }: { data: Array<{ name: string; first: number; topThreeOther: number; afterTopThree: number }>; onBrandClick?: (brand: string) => void }) {
  const clickBrand = (entry: { payload?: { name?: string } }) => { if (entry.payload?.name) onBrandClick?.(entry.payload.name); };
  return <ChartFrame title="品牌提及位置分布"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.slice(0, 8)} margin={{ top: 12, right: 8, left: -15, bottom: 0 }}><CartesianGrid vertical={false} stroke="#edf0ef" /><XAxis dataKey="name" tick={{ fill: slate, fontSize: 10 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: slate, fontSize: 10 }} axisLine={false} tickLine={false} /><Tooltip {...tooltip} /><Legend wrapperStyle={{ fontSize: 11 }} /><Bar dataKey="first" name="首位" stackId="position" fill={green} onClick={clickBrand} /><Bar dataKey="topThreeOther" name="前三其他位置" stackId="position" fill={mint} onClick={clickBrand} /><Bar dataKey="afterTopThree" name="前三之后" stackId="position" fill="#c7d3cf" radius={[5, 5, 0, 0]} onClick={clickBrand} /></BarChart></ResponsiveContainer></ChartFrame>;
}
