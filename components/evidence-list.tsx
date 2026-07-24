"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DemoEvidence, platformColors } from "@/lib/demo-data";
import { EvidenceFilters, getPaginationItems, searchEvidence } from "@/lib/evidence-search";

const pageSize = 20;
const defaultFilters: Required<EvidenceFilters> = {
  query: "",
  platform: "全部平台",
  batch: "全部复查记录",
  mentioned: "全部提及情况",
  ranking: "全部排名",
  advantage: "全部优势判断",
};

export function EvidenceList({ records }: { records: DemoEvidence[] }) {
  const [draftFilters, setDraftFilters] = useState(defaultFilters);
  const [submittedFilters, setSubmittedFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const batches = [...new Set(records.map((item) => item.batchName))];
  const result = useMemo(
    () => searchEvidence(records, submittedFilters, page, pageSize),
    [records, submittedFilters, page]
  );
  const firstRecord = result.total === 0 ? 0 : (result.page - 1) * pageSize + 1;
  const lastRecord = Math.min(result.page * pageSize, result.total);

  function updateFilter(key: keyof EvidenceFilters, value: string) {
    setDraftFilters((current) => ({ ...current, [key]: value }));
  }

  function submitSearch() {
    setSubmittedFilters(draftFilters);
    setPage(1);
  }

  return <section className="evidence-panel"><div className="section-top"><div><p className="eyebrow">原始记录</p><h2>AI 问答记录</h2><p className="muted">每一条结果均保留平台原始回答，可自行核验。</p></div><span className="result-count">共 {result.total} 条记录</span></div><form className="filters" onSubmit={(event) => { event.preventDefault(); submitSearch(); }}><input value={draftFilters.query} onChange={(event) => updateFilter("query", event.target.value)} placeholder="搜索问题或回答" /><select aria-label="复查记录" value={draftFilters.batch} onChange={(event) => updateFilter("batch", event.target.value)}><option>全部复查记录</option>{batches.map((name) => <option key={name}>{name}</option>)}</select><select aria-label="提及客户" value={draftFilters.mentioned} onChange={(event) => updateFilter("mentioned", event.target.value)}><option>全部提及情况</option><option>提及客户</option><option>未提及客户</option></select><select aria-label="排名" value={draftFilters.ranking} onChange={(event) => updateFilter("ranking", event.target.value)}><option>全部排名</option><option>排名前三</option><option>未进前三</option></select><select aria-label="优势" value={draftFilters.advantage} onChange={(event) => updateFilter("advantage", event.target.value)}><option>全部优势判断</option><option>优势明显</option><option>优势不明显</option></select><button className="search-button" type="submit">查询</button></form><div className="platform-filters">{["全部平台", "豆包", "DeepSeek", "元宝", "Kimi", "千问"].map((name) => <button type="button" key={name} onClick={() => updateFilter("platform", name)} className={draftFilters.platform === name ? "active" : ""}>{name}</button>)}</div><div className="evidence-table">{result.total === 0 ? <p className="empty-records">暂无符合条件的记录</p> : result.rows.map((item) => <Link href={`/client/evidence/${item.id}`} className="evidence-row" key={item.id}><span className="platform-pill" style={{ color: platformColors[item.platform], background: `${platformColors[item.platform]}17` }}>{item.platform}</span><div className="question"><b>{item.question}</b><span>{item.answer}</span></div><div className="tags"><i className={item.mentionedTarget ? "yes" : "no"}>{item.mentionedTarget ? "提及客户" : "未提及客户"}</i><i className={item.rankedTopThree ? "yes" : "no"}>{item.rankedTopThree ? "排名前三" : "未进前三"}</i></div><span className="arrow">→</span></Link>)}</div>{result.total > 0 && <nav className="pagination" aria-label="记录分页"><span>显示 {firstRecord}–{lastRecord} 条，共 {result.total} 条</span><div><button type="button" onClick={() => setPage(result.page - 1)} disabled={result.page === 1}>上一页</button>{getPaginationItems(result.totalPages).map((item, index) => item === "ellipsis" ? <span className="pagination-ellipsis" key={`ellipsis-${index}`}>…</span> : <button type="button" key={item} onClick={() => setPage(item)} className={result.page === item ? "active" : ""}>{item}</button>)}<button type="button" onClick={() => setPage(result.page + 1)} disabled={result.page === result.totalPages}>下一页</button></div></nav>}</section>;
}
