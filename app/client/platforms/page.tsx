"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ClientLayout } from "@/components/client-layout";
import { ClientPageHeader } from "@/components/client-page-header";
import { PlatformPerformanceTable } from "@/components/performance-tables";
import { BatchRatesChart, PlatformRatesChart } from "@/components/dashboard-charts";
import { demoEvidence } from "@/lib/demo-data";
import { getBatchChartData, getBatchSummaries, getPlatformChartData, getPlatformSummaries } from "@/lib/evidence-analytics";

function PlatformsContent() {
  const searchParams = useSearchParams(); const router = useRouter(); const pathname = usePathname();
  const batches = getBatchSummaries(demoEvidence); const batchNames = batches.map((batch) => batch.name);
  const selectedBatch = batchNames.includes(searchParams.get("batch") ?? "") ? searchParams.get("batch")! : batchNames[0];
  const records = demoEvidence.filter((record) => record.batchName === selectedBatch); const rows = getPlatformSummaries(records);
  const selectedPlatform = rows.some((row) => row.platform === searchParams.get("platform")) ? searchParams.get("platform")! : "全部平台";
  const displayedRows = selectedPlatform === "全部平台" ? rows : rows.filter((row) => row.platform === selectedPlatform);
  const setPlatform = (platform: string) => { const params = new URLSearchParams(searchParams.toString()); if (platform === "全部平台") params.delete("platform"); else params.set("platform", platform); router.replace(`${pathname}?${params.toString()}`); };
  const crossBatch = selectedPlatform === "全部平台" ? [] : batches.map((batch) => ({ batch: batch.name, row: getPlatformSummaries(demoEvidence.filter((record) => record.batchName === batch.name)).find((row) => row.platform === selectedPlatform) }));
  const platformChartData = getPlatformChartData(records);
  return <ClientLayout><ClientPageHeader eyebrow="AI 平台" title="平台表现" description="仅比较本批次实际采集的平台；未采集的平台不会以 0% 参与比较。" batches={batchNames} selectedBatch={selectedBatch} /><section className="chart-grid chart-grid-single"><PlatformRatesChart data={platformChartData} onPlatformClick={setPlatform} /></section><section className="dashboard-card"><div className="section-top"><div><p className="eyebrow">平台筛选</p><h2>本批次平台对比</h2></div><label className="inline-select"><span>平台</span><select value={selectedPlatform} onChange={(event) => setPlatform(event.target.value)}><option>全部平台</option>{rows.map((row) => <option key={row.platform}>{row.platform}</option>)}</select></label></div><PlatformPerformanceTable rows={displayedRows} batch={selectedBatch} /></section>{selectedPlatform !== "全部平台" && <section className="dashboard-card"><div className="section-top"><div><p className="eyebrow">跨批次</p><h2>{selectedPlatform} 复查记录</h2></div></div><BatchRatesChart data={getBatchChartData(demoEvidence.filter((record) => record.platform === selectedPlatform))} /><div className="table-scroll"><table className="data-table"><thead><tr><th>复查批次</th><th>状态</th><th>记录数</th><th>提及率</th><th>前三率</th><th>优势率</th><th>首位率</th><th>平均位置</th></tr></thead><tbody>{crossBatch.map(({ batch, row }) => row ? <tr key={batch}><td>{batch}</td><td>已采集</td><td>{row.recordCount}</td><td>{row.mentionRate?.toFixed(1)}%</td><td>{row.topThreeRate?.toFixed(1)}%</td><td>{row.advantageRate?.toFixed(1)}%</td><td>{row.firstMentionRate?.toFixed(1)}%</td><td>{row.averageMentionPosition?.toFixed(1) ?? "—"}</td></tr> : <tr key={batch}><td>{batch}</td><td colSpan={7} className="missing-cell">本批次未采集</td></tr>)}</tbody></table></div></section>}</ClientLayout>;
}

export default function PlatformsPage() { return <Suspense fallback={<main className="auth-loading">正在载入平台表现…</main>}><PlatformsContent /></Suspense>; }
