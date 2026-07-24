export const SUPPORTED_PLATFORMS = ["豆包", "DeepSeek", "元宝", "Kimi", "千问"] as const;

export type EvidenceRow = {
  anaId: number;
  platform: (typeof SUPPORTED_PLATFORMS)[number];
  question: string;
  batchName: string;
  answer: string;
  advantageObvious: boolean;
  positiveKeywords: string;
  negativeKeywords: string;
  rankedTopThree: boolean;
  mentionedTarget: boolean;
  mentionedIndustryBrand: boolean;
  collectedAt: string;
  brandMentions: string[];
  raw: Record<string, unknown>;
};

export type InvalidRow = { row: number; errors: string[]; raw: Record<string, unknown> };

export type ValidationResult = { validRows: EvidenceRow[]; invalidRows: InvalidRow[] };

const requiredFields = [
  "ana_id", "AI平台", "问题", "上传批次", "AI输出的答案", "客户的优势是否明显",
  "有利的关键词", "不利的关键词", "客户的排名是否为前三", "是否有提及目标客户",
  "是否有提及目标行业的品牌", "上传时间",
] as const;

function parseBoolean(value: unknown, label: string, errors: string[]) {
  if (value === "是") return true;
  if (value === "否") return false;
  errors.push(`${label} 只能为“是”或“否”`);
  return false;
}

function text(value: unknown) {
  return String(value ?? "").trim();
}

export function validateRows(rows: Record<string, unknown>[]): ValidationResult {
  const seen = new Set<number>();
  const validRows: EvidenceRow[] = [];
  const invalidRows: InvalidRow[] = [];

  rows.forEach((raw, index) => {
    const errors: string[] = [];
    for (const field of requiredFields) {
      if (!text(raw[field])) errors.push(`${field} 为必填项`);
    }
    const anaId = Number(raw.ana_id);
    if (!Number.isInteger(anaId) || anaId <= 0) errors.push("ana_id 必须为正整数");
    if (seen.has(anaId)) errors.push("ana_id 重复");
    seen.add(anaId);

    const platform = text(raw.AI平台);
    if (!SUPPORTED_PLATFORMS.includes(platform as (typeof SUPPORTED_PLATFORMS)[number])) {
      errors.push(`不支持的 AI 平台：${platform}`);
    }

    const advantageObvious = parseBoolean(raw.客户的优势是否明显, "客户的优势是否明显", errors);
    const rankedTopThree = parseBoolean(raw.客户的排名是否为前三, "客户的排名是否为前三", errors);
    const mentionedTarget = parseBoolean(raw.是否有提及目标客户, "是否有提及目标客户", errors);
    const mentionedIndustryBrand = parseBoolean(raw.是否有提及目标行业的品牌, "是否有提及目标行业的品牌", errors);

    if (errors.length > 0) {
      invalidRows.push({ row: index + 2, errors, raw });
      return;
    }

    const brandMentions = Array.from({ length: 10 }, (_, brandIndex) => text(raw[`品牌${brandIndex + 1}`]))
      .filter(Boolean);
    validRows.push({
      anaId,
      platform: platform as EvidenceRow["platform"],
      question: text(raw.问题),
      batchName: text(raw.上传批次),
      answer: text(raw.AI输出的答案),
      advantageObvious,
      positiveKeywords: text(raw.有利的关键词),
      negativeKeywords: text(raw.不利的关键词),
      rankedTopThree,
      mentionedTarget,
      mentionedIndustryBrand,
      collectedAt: text(raw.上传时间),
      brandMentions,
      raw,
    });
  });
  return { validRows, invalidRows };
}
