import Link from "next/link";
import { ClientLayout } from "@/components/client-layout";
import { ClientPageHeader } from "@/components/client-page-header";
import { TrendChart } from "@/components/trend-chart";
import { demoEvidence } from "@/lib/demo-data";
import { formatPercent, formatPosition, getBatchSummaries } from "@/lib/evidence-analytics";

export default function TrendsPage() {
  const batches = getBatchSummaries(demoEvidence); const points = [...batches].reverse().map((batch) => ({ label: batch.name, mentionRate: batch.mentionRate, topThreeRate: batch.topThreeRate, advantageRate: batch.advantageRate }));
  return <ClientLayout><ClientPageHeader eyebrow="持续复查" title="复查批次趋势" description="每个批次按实际有效记录与平台组合独立汇总，不假设问题或平台完全一致。" /><section className="dashboard-card"><TrendChart points={points} /></section><section className="dashboard-card"><div className="section-top"><div><p className="eyebrow">批次明细</p><h2>实际覆盖与成效汇总</h2></div></div><div className="table-scroll"><table className="data-table"><thead><tr><th>复查批次</th><th>记录</th><th>问题</th><th>平台</th><th>目标品牌提及率</th><th>前三率</th><th>优势率</th><th>首位率</th><th>平均位置</th><th>实际平台覆盖</th></tr></thead><tbody>{batches.map((batch) => <tr key={batch.name}><td><Link className="table-link" href={`/client/overview?batch=${encodeURIComponent(batch.name)}`}>{batch.name}</Link></td><td>{batch.recordCount}</td><td>{batch.questionCount}</td><td>{batch.platformCount}</td><td>{formatPercent(batch.mentionRate)}</td><td>{formatPercent(batch.topThreeRate)}</td><td>{formatPercent(batch.advantageRate)}</td><td>{formatPercent(batch.firstMentionRate)}</td><td>{formatPosition(batch.averageMentionPosition)}</td><td>{batch.platforms.join("、")}</td></tr>)}</tbody></table></div></section></ClientLayout>;
}
