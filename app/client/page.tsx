import { EvidenceList } from "@/components/evidence-list";
import { Sidebar } from "@/components/sidebar";
import { AuthGate } from "@/components/auth-gate";
import { demoEvidence } from "@/lib/demo-data";

export default function ClientPage() {
  const questionCount = new Set(demoEvidence.map((row) => row.question)).size;
  const platformCount = new Set(demoEvidence.map((row) => row.platform)).size;
  return <AuthGate><main className="app-shell"><Sidebar /><div className="content"><header className="app-header"><div><p className="eyebrow">数据总览</p><h1>AI 问答记录</h1><p className="muted">浏览、筛选并核验采集自 AI 平台的完整原始回答。</p></div></header><section className="metrics"><article><span>采集记录</span><b>{demoEvidence.length}</b><small>完整原始回答</small></article><article><span>覆盖问题</span><b>{questionCount}</b><small>不同提问场景</small></article><article><span>已采集平台</span><b>{platformCount}</b><small>按原始记录统计</small></article></section><EvidenceList records={demoEvidence} /></div></main></AuthGate>;
}
