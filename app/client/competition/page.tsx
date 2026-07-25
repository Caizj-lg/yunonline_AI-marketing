"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ClientLayout } from "@/components/client-layout";
import { ClientPageHeader } from "@/components/client-page-header";
import { MetricCard } from "@/components/metric-card";
import { BrandPerformanceTable, PlatformPerformanceTable } from "@/components/performance-tables";
import { demoEvidence } from "@/lib/demo-data";
import { calculateMetrics, formatPercent, getBatchSummaries, getBrandCompetition, getPlatformSummaries } from "@/lib/evidence-analytics";
import { projectConfig } from "@/lib/project-config";

function CompetitionContent() {
  const searchParams = useSearchParams(); const batches = getBatchSummaries(demoEvidence); const batchNames = batches.map((batch) => batch.name);
  const selectedBatch = batchNames.includes(searchParams.get("batch") ?? "") ? searchParams.get("batch")! : batchNames[0];
  const records = demoEvidence.filter((record) => record.batchName === selectedBatch); const brands = getBrandCompetition(records); const metrics = calculateMetrics(records); const platforms = getPlatformSummaries(records);
  const target = brands.find((brand) => brand.name === projectConfig.targetBrand); const targetEvidence = `/client/evidence?batch=${encodeURIComponent(selectedBatch)}&brand=${encodeURIComponent(projectConfig.targetBrand)}`;
  return <ClientLayout><ClientPageHeader eyebrow="品牌竞争" title="品牌提及表现" description="按原始回答中的品牌出现顺序统计，共同出现情况可回到完整 AI 问答核验。" batches={batchNames} selectedBatch={selectedBatch} /><section className="metrics metrics-rich"><MetricCard label="目标品牌提及" value={target?.mentionCount ?? 0} detail={formatPercent(metrics.mentionRate)} href={targetEvidence} /><MetricCard label="目标品牌首位" value={target?.firstMentionCount ?? 0} detail={formatPercent(metrics.firstMentionRate)} href={targetEvidence} /><MetricCard label="目标品牌前三" value={target?.topThreeCount ?? 0} detail="品牌出现顺序前三位" href={targetEvidence} /><MetricCard label="共同出现品牌" value={brands.length} detail="去重后的品牌名称" /></section><section className="dashboard-card"><div className="section-top"><div><p className="eyebrow">品牌明细</p><h2>品牌提及顺序与覆盖</h2></div></div><BrandPerformanceTable rows={brands} batch={selectedBatch} /></section><section className="dashboard-card"><div className="section-top"><div><p className="eyebrow">平台差异</p><h2>各平台中的目标品牌表现</h2></div></div><PlatformPerformanceTable rows={platforms} batch={selectedBatch} /></section></ClientLayout>;
}

export default function CompetitionPage() { return <Suspense fallback={<main className="auth-loading">正在载入品牌竞争…</main>}><CompetitionContent /></Suspense>; }
