import { DemoEvidence } from "./demo-data";
import { getLatestBatchName, normalizeBrandName } from "./evidence-analytics";

export type EvidenceFilters = Partial<{
  query: string;
  platform: string;
  batch: string;
  mentioned: string;
  ranking: string;
  advantage: string;
  industryBrand: string;
  brand: string;
}>;

export const defaultEvidenceFilters: Required<EvidenceFilters> = {
  query: "",
  platform: "全部平台",
  batch: "全部复查记录",
  mentioned: "全部提及情况",
  ranking: "全部排名",
  advantage: "全部优势判断",
  industryBrand: "全部行业品牌情况",
  brand: "",
};

export function getEvidenceFiltersFromParams(params: URLSearchParams, records: DemoEvidence[]): Required<EvidenceFilters> {
  const requestedBatch = params.get("batch");
  const latestBatch = getLatestBatchName(records);
  const batch = requestedBatch === "all" ? "全部复查记录" : records.some((record) => record.batchName === requestedBatch) ? requestedBatch! : latestBatch ?? defaultEvidenceFilters.batch;
  return {
    ...defaultEvidenceFilters,
    batch,
    query: params.get("query") ?? "",
    platform: params.get("platform") ?? defaultEvidenceFilters.platform,
    mentioned: params.get("mentioned") ?? defaultEvidenceFilters.mentioned,
    ranking: params.get("ranking") ?? defaultEvidenceFilters.ranking,
    advantage: params.get("advantage") ?? defaultEvidenceFilters.advantage,
    industryBrand: params.get("industryBrand") ?? defaultEvidenceFilters.industryBrand,
    brand: params.get("brand") ?? "",
  };
}

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
    (!filters.industryBrand || filters.industryBrand === "全部行业品牌情况" || item.mentionedIndustryBrand === (filters.industryBrand === "提及行业品牌")) &&
    (!filters.brand || item.brands.some((brand) => normalizeBrandName(brand).includes(normalizeBrandName(filters.brand!)))) &&
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
