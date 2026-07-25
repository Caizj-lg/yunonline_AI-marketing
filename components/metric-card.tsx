import Link from "next/link";

export function MetricCard({ label, value, detail, href }: { label: string; value: string | number; detail: string; href?: string }) {
  const content = <article className="metric-card"><span>{label}</span><b>{value}</b><small>{detail}</small></article>;
  return href ? <Link href={href} className="metric-link">{content}</Link> : content;
}
