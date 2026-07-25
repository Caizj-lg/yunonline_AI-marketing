import { describe, expect, it } from "vitest";
import {
  calculateMetrics,
  getBatchSummaries,
  getBrandCompetition,
  getLatestBatchName,
  getPlatformSummaries,
  normalizeBrandName,
} from "../lib/evidence-analytics";

const records = [
  { id: "1", anaId: 1, platform: "豆包", question: "问题 A", batchName: "2026年5月复查", answer: "回答", collectedAt: "2026-05-30 10:00:00", mentionedTarget: true, rankedTopThree: true, advantageObvious: true, mentionedIndustryBrand: true, positiveKeywords: "服务", negativeKeywords: "无", brands: ["竞品 A", "日立"] },
  { id: "2", anaId: 2, platform: "DeepSeek", question: "问题 B", batchName: "2026年5月复查", answer: "回答", collectedAt: "2026-05-31 10:00:00", mentionedTarget: true, rankedTopThree: false, advantageObvious: false, mentionedIndustryBrand: true, positiveKeywords: "无", negativeKeywords: "无", brands: ["日立电梯", "竞品 B", "竞品 B"] },
  { id: "3", anaId: 3, platform: "Kimi", question: "问题 C", batchName: "2026年6月复查", answer: "回答", collectedAt: "2026-06-30 10:00:00", mentionedTarget: false, rankedTopThree: false, advantageObvious: true, mentionedIndustryBrand: false, positiveKeywords: "无", negativeKeywords: "无", brands: ["竞品 A"] },
] as const;

describe("evidence analytics", () => {
  it("calculates metrics with target brand aliases and first positions", () => {
    const metrics = calculateMetrics(records);

    expect(metrics).toMatchObject({
      recordCount: 3,
      questionCount: 3,
      platformCount: 3,
      mentionedCount: 2,
      mentionRate: 66.7,
      topThreeCount: 1,
      topThreeRate: 33.3,
      advantageCount: 2,
      advantageRate: 66.7,
      firstMentionCount: 1,
      firstMentionRate: 33.3,
      averageMentionPosition: 1.5,
    });
  });

  it("groups batches newest first and preserves different platform coverage", () => {
    const batches = getBatchSummaries(records);

    expect(batches.map((batch) => batch.name)).toEqual(["2026年6月复查", "2026年5月复查"]);
    expect(batches[0].platforms).toEqual(["Kimi"]);
    expect(batches[1].platforms).toEqual(["DeepSeek", "豆包"]);
    expect(getLatestBatchName(records)).toBe("2026年6月复查");
  });

  it("does not turn a missing platform into a zero-value platform summary", () => {
    const platforms = getPlatformSummaries(records.filter((record) => record.batchName === "2026年6月复查"));

    expect(platforms.map((platform) => platform.platform)).toEqual(["Kimi"]);
  });

  it("deduplicates brand mentions in one answer and keeps first occurrence", () => {
    const competition = getBrandCompetition(records);
    const competitorB = competition.find((brand) => brand.name === "竞品 B");

    expect(competitorB).toMatchObject({ mentionCount: 1, firstMentionCount: 0, topThreeCount: 1, averagePosition: 2 });
    expect(normalizeBrandName(" 日立 ELEVATOR ")).toBe("日立 elevator");
  });

  it("returns safe empty metrics", () => {
    expect(calculateMetrics([])).toMatchObject({ recordCount: 0, mentionRate: null, averageMentionPosition: null });
  });
});
