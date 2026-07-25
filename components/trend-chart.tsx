type TrendPoint = { label: string; mentionRate: number | null; topThreeRate: number | null; advantageRate: number | null };

const series = [
  { key: "mentionRate", label: "提及率", color: "#08946d" },
  { key: "topThreeRate", label: "前三率", color: "#4e8d7c" },
  { key: "advantageRate", label: "优势率", color: "#b2873b" },
] as const;

export function TrendChart({ points }: { points: TrendPoint[] }) {
  if (points.length < 2) return <div className="chart-empty">当前仅有一个可比较批次。新增复查数据后，此处将自动展示真实趋势。</div>;
  const width = 640; const height = 220; const padding = 30;
  const point = (index: number, value: number) => `${padding + index * ((width - padding * 2) / (points.length - 1))},${height - padding - value * ((height - padding * 2) / 100)}`;
  return <div className="trend-chart"><div className="chart-legend">{series.map((item) => <span key={item.key}><i style={{ background: item.color }} />{item.label}</span>)}</div><svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="批次成效趋势">{[0, 25, 50, 75, 100].map((value) => <g key={value}><line x1={padding} x2={width - padding} y1={height - padding - value * ((height - padding * 2) / 100)} y2={height - padding - value * ((height - padding * 2) / 100)} stroke="#edf0ef" /><text x="0" y={height - padding - value * ((height - padding * 2) / 100) + 4} fill="#7a818a" fontSize="10">{value}%</text></g>)}{series.map((item) => { const values = points.map((pointItem) => pointItem[item.key]); if (values.some((value) => value === null)) return null; const path = values.map((value, index) => `${index === 0 ? "M" : "L"}${point(index, value!)}`).join(" "); return <g key={item.key}><path d={path} fill="none" stroke={item.color} strokeWidth="3" />{values.map((value, index) => <circle key={index} cx={point(index, value!).split(",")[0]} cy={point(index, value!).split(",")[1]} r="4" fill={item.color}><title>{`${points[index].label} · ${item.label} ${value!.toFixed(1)}%`}</title></circle>)}</g>; })}{points.map((item, index) => <text key={item.label} x={padding + index * ((width - padding * 2) / (points.length - 1))} y={height - 6} textAnchor="middle" fill="#7a818a" fontSize="10">{item.label}</text>)}</svg></div>;
}
