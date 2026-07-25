"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ClientLayout } from "@/components/client-layout";
import { ClientPageHeader } from "@/components/client-page-header";
import { EvidenceList } from "@/components/evidence-list";
import { demoEvidence } from "@/lib/demo-data";
import { getBatchSummaries } from "@/lib/evidence-analytics";

function EvidenceContent() {
  const searchParams = useSearchParams(); const batches = getBatchSummaries(demoEvidence).map((batch) => batch.name);
  const selectedBatch = batches.includes(searchParams.get("batch") ?? "") ? searchParams.get("batch")! : batches[0];
  return <ClientLayout><ClientPageHeader eyebrow="原始证据" title="AI 问答记录" description="筛选并核验采集自 AI 平台的完整原始回答；所有结果保留原文。" batches={batches} selectedBatch={selectedBatch} /><EvidenceList records={demoEvidence} /></ClientLayout>;
}

export default function EvidencePage() { return <Suspense fallback={<main className="auth-loading">正在载入原始证据…</main>}><EvidenceContent /></Suspense>; }
