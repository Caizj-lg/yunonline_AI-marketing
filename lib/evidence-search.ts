import { DemoEvidence } from "./demo-data";

export type EvidenceFilters = Partial<{
  query: string;
  platform: string;
  batch: string;
  mentioned: string;
  ranking: string;
  advantage: string;
}>;

export function getPaginationItems(totalPages: number): Array<number | "ellipsis"> {
  if (totalPages <= 6) return Array.from({ length: totalPages }, (_, index) => index + 1);
  return [1, 2, 3, "ellipsis", totalPages - 2, totalPages - 1, totalPages];
}

export function searchEvidence(records: DemoEvidence[], filters: EvidenceFilters, page: number, pageSize: number) {
  const rows = records.filter((item) =>
    (!filters.platform || filters.platform === "全部平台" || item.platform === filters.platform) &&
    (!filters.batch || filters.batch === "全部复查记录" || item.batchName === filters.batch) &&
    (!filters.mentioned || filters.mentioned === "全部提及情况" || item.mentionedTarget === (filters.mentioned === "提及客户")) &&
    (!filters.ranking || filters.ranking === "全部排名" || item.rankedTopThree === (filters.ranking === "排名前三")) &&
    (!filters.advantage || filters.advantage === "全部优势判断" || item.advantageObvious === (filters.advantage === "优势明显")) &&
    (!filters.query || item.question.includes(filters.query) || item.answer.includes(filters.query))
  );
  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);

  return {
    rows: rows.slice((safePage - 1) * pageSize, safePage * pageSize),
    total,
    totalPages,
    page: safePage,
  };
}
