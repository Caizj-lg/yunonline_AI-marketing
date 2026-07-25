import Link from "next/link";
import { notFound } from "next/navigation";
import { ClientLayout } from "@/components/client-layout";
import { demoEvidence, platformColors } from "@/lib/demo-data";

export default async function EvidenceDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = demoEvidence.find((item) => item.id === id);
  if (!row) notFound();
  return <ClientLayout><div className="detail"><Link className="back" href="/client/evidence">← 返回原始证据</Link><header className="detail-header"><span className="platform-pill" style={{ color: platformColors[row.platform], background: `${platformColors[row.platform]}17` }}>{row.platform}</span><p className="eyebrow">原始记录 #{row.id}</p><h1>{row.question}</h1><p className="muted">采集时间：{row.collectedAt} · 此页面完整保留该条 AI 回答。</p></header><section className="detail-grid"><article className="raw-answer"><div className="card-title"><span>AI 平台原始回答</span><i>未改写</i></div><p>{row.answer}</p></article><aside className="facts"><h3>人工复查判断</h3><div><span>提及客户</span><b className={row.mentionedTarget ? "status yes" : "status no"}>{row.mentionedTarget ? "是" : "否"}</b></div><div><span>排名是否前三</span><b className={row.rankedTopThree ? "status yes" : "status no"}>{row.rankedTopThree ? "是" : "否"}</b></div><div><span>提及行业品牌</span><b className={row.mentionedIndustryBrand ? "status yes" : "status no"}>{row.mentionedIndustryBrand ? "是" : "否"}</b></div><hr /><span>有利关键词</span><p>{row.positiveKeywords}</p><span>不利关键词</span><p>{row.negativeKeywords}</p></aside></section><section className="brands"><p className="eyebrow">回答中提及的品牌</p><h2>提及顺序</h2><div>{row.brands.map((brand, index) => <span key={brand}><i>{index + 1}</i>{brand}</span>)}</div></section></div></ClientLayout>;
}

export function generateStaticParams() { return demoEvidence.map((row) => ({ id: row.id })); }
