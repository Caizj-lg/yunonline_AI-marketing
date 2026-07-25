import Link from "next/link";
import { BrandSummary, PlatformSummary, formatPercent, formatPosition } from "@/lib/evidence-analytics";

export function PlatformPerformanceTable({ rows, batch }: { rows: PlatformSummary[]; batch: string }) {
  return <div className="table-scroll"><table className="data-table"><thead><tr><th>AI 平台</th><th>记录数</th><th>提及率</th><th>前三率</th><th>首位率</th><th>优势率</th><th>平均位置</th><th /></tr></thead><tbody>{rows.map((row) => <tr key={row.platform}><td><b>{row.platform}</b></td><td>{row.recordCount}</td><td>{formatPercent(row.mentionRate)}</td><td>{formatPercent(row.topThreeRate)}</td><td>{formatPercent(row.firstMentionRate)}</td><td>{formatPercent(row.advantageRate)}</td><td>{formatPosition(row.averageMentionPosition)}</td><td><Link className="table-link" href={`/client/evidence?batch=${encodeURIComponent(batch)}&platform=${encodeURIComponent(row.platform)}`}>查看证据</Link></td></tr>)}</tbody></table></div>;
}

export function BrandPerformanceTable({ rows, batch }: { rows: BrandSummary[]; batch: string }) {
  return <div className="table-scroll"><table className="data-table"><thead><tr><th>品牌</th><th>提及次数</th><th>提及率</th><th>首位次数</th><th>前三次数</th><th>平均位置</th><th /></tr></thead><tbody>{rows.map((row) => <tr key={row.name}><td><b>{row.name}</b></td><td>{row.mentionCount}</td><td>{formatPercent(row.mentionRate)}</td><td>{row.firstMentionCount}</td><td>{row.topThreeCount}</td><td>{formatPosition(row.averagePosition)}</td><td><Link className="table-link" href={`/client/evidence?batch=${encodeURIComponent(batch)}&brand=${encodeURIComponent(row.name)}`}>查看证据</Link></td></tr>)}</tbody></table></div>;
}
