import { projectConfig } from "./project-config";

export type EvidenceRecord = {
  id: string;
  platform: string;
  question: string;
  batchName: string;
  collectedAt: string;
  mentionedTarget: boolean;
  rankedTopThree: boolean;
  advantageObvious: boolean;
  mentionedIndustryBrand: boolean;
  brands: readonly string[];
};

export type EvidenceMetrics = {
  recordCount: number;
  questionCount: number;
  platformCount: number;
  mentionedCount: number;
  mentionRate: number | null;
  topThreeCount: number;
  topThreeRate: number | null;
  advantageCount: number;
  advantageRate: number | null;
  firstMentionCount: number;
  firstMentionRate: number | null;
  averageMentionPosition: number | null;
};

export type BatchSummary = EvidenceMetrics & { name: string; platforms: string[]; latestCollectedAt: string };
export type PlatformSummary = EvidenceMetrics & { platform: string };
export type BrandSummary = { name: string; mentionCount: number; mentionRate: number | null; firstMentionCount: number; topThreeCount: number; averagePosition: number | null };

const targetAliases = new Set([projectConfig.targetBrand, ...projectConfig.targetBrandAliases].map(normalizeBrandName));

export function normalizeBrandName(value: string) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

function percent(value: number, total: number) {
  return total === 0 ? null : Number(((value / total) * 100).toFixed(1));
}

function targetPosition(brands: readonly string[]) {
  const seen = new Set<string>();
  for (const [index, brand] of brands.entries()) {
    const normalized = normalizeBrandName(brand);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    if (targetAliases.has(normalized)) return index + 1;
  }
  return null;
}

function uniqueBrands(brands: readonly string[]) {
  const seen = new Set<string>();
  return brands.flatMap((brand, index) => {
    const normalized = normalizeBrandName(brand);
    if (!normalized || seen.has(normalized)) return [];
    seen.add(normalized);
    return [{ normalized, displayName: targetAliases.has(normalized) ? projectConfig.targetBrand : brand.trim(), position: index + 1 }];
  });
}

export function calculateMetrics(records: readonly EvidenceRecord[]): EvidenceMetrics {
  const recordCount = records.length;
  const mentionedCount = records.filter((record) => record.mentionedTarget).length;
  const topThreeCount = records.filter((record) => record.rankedTopThree).length;
  const advantageCount = records.filter((record) => record.advantageObvious).length;
  const positions = records.flatMap((record) => {
    const position = targetPosition(record.brands);
    return position === null ? [] : [position];
  });
  const firstMentionCount = positions.filter((position) => position === 1).length;

  return {
    recordCount,
    questionCount: new Set(records.map((record) => record.question)).size,
    platformCount: new Set(records.map((record) => record.platform)).size,
    mentionedCount,
    mentionRate: percent(mentionedCount, recordCount),
    topThreeCount,
    topThreeRate: percent(topThreeCount, recordCount),
    advantageCount,
    advantageRate: percent(advantageCount, recordCount),
    firstMentionCount,
    firstMentionRate: percent(firstMentionCount, recordCount),
    averageMentionPosition: positions.length === 0 ? null : Number((positions.reduce((sum, position) => sum + position, 0) / positions.length).toFixed(1)),
  };
}

export function getBatchSummaries(records: readonly EvidenceRecord[]): BatchSummary[] {
  const groups = new Map<string, EvidenceRecord[]>();
  records.forEach((record) => groups.set(record.batchName, [...(groups.get(record.batchName) ?? []), record]));
  return [...groups.entries()].map(([name, batchRecords]) => {
    const latestCollectedAt = batchRecords.map((record) => record.collectedAt).sort().at(-1) ?? "";
    return { name, latestCollectedAt, platforms: [...new Set(batchRecords.map((record) => record.platform))].sort(), ...calculateMetrics(batchRecords) };
  }).sort((a, b) => b.latestCollectedAt.localeCompare(a.latestCollectedAt));
}

export function getLatestBatchName(records: readonly EvidenceRecord[]) {
  return getBatchSummaries(records)[0]?.name ?? null;
}

export function getPlatformSummaries(records: readonly EvidenceRecord[]): PlatformSummary[] {
  const groups = new Map<string, EvidenceRecord[]>();
  records.forEach((record) => groups.set(record.platform, [...(groups.get(record.platform) ?? []), record]));
  return [...groups.entries()].map(([platform, platformRecords]) => ({ platform, ...calculateMetrics(platformRecords) })).sort((a, b) => a.platform.localeCompare(b.platform));
}

export function getBrandCompetition(records: readonly EvidenceRecord[]): BrandSummary[] {
  const groups = new Map<string, { name: string; positions: number[] }>();
  records.forEach((record) => uniqueBrands(record.brands).forEach((brand) => {
    const current = groups.get(brand.normalized) ?? { name: brand.displayName, positions: [] };
    current.positions.push(brand.position);
    groups.set(brand.normalized, current);
  }));
  return [...groups.values()].map(({ name, positions }) => ({
    name,
    mentionCount: positions.length,
    mentionRate: percent(positions.length, records.length),
    firstMentionCount: positions.filter((position) => position === 1).length,
    topThreeCount: positions.filter((position) => position <= 3).length,
    averagePosition: Number((positions.reduce((sum, position) => sum + position, 0) / positions.length).toFixed(1)),
  })).sort((a, b) => b.mentionCount - a.mentionCount || a.averagePosition! - b.averagePosition!);
}

export function getRecordsForBatch<T extends EvidenceRecord>(records: readonly T[], batchName: string | null) {
  return batchName ? records.filter((record) => record.batchName === batchName) : records;
}

export function formatPercent(value: number | null) {
  return value === null ? "—" : `${value.toFixed(1)}%`;
}

export function formatPosition(value: number | null) {
  return value === null ? "—" : value.toFixed(1);
}
