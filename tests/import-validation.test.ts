import { describe, expect, it } from "vitest";
import { validateRows } from "../lib/import-validation";

const validRow = {
  ana_id: 1,
  AI平台: "豆包",
  问题: "电梯更新应该怎么选？",
  上传批次: "2026-06",
  AI输出的答案: "这是完整的 AI 回答。",
  客户的优势是否明显: "是",
  有利的关键词: "服务",
  不利的关键词: "无",
  客户的排名是否为前三: "否",
  是否有提及目标客户: "是",
  是否有提及目标行业的品牌: "是",
  上传时间: "2026-06-30 17:30:00",
  品牌1: "云启智联"
};

describe("validateRows", () => {
  it("accepts raw evidence and preserves ordered brand mentions", () => {
    const result = validateRows([validRow]);
    expect(result.validRows).toHaveLength(1);
    expect(result.invalidRows).toHaveLength(0);
    expect(result.validRows[0].brandMentions).toEqual(["云启智联"]);
  });

  it("rejects missing answers, unknown platforms and invalid judgement values", () => {
    const result = validateRows([
      { ...validRow, AI平台: "未知平台" },
      { ...validRow, ana_id: 2, AI输出的答案: "" },
      { ...validRow, ana_id: 3, 是否有提及目标客户: "可能" }
    ]);
    expect(result.validRows).toHaveLength(0);
    expect(result.invalidRows).toHaveLength(3);
  });

  it("rejects duplicate ana_id values within a batch", () => {
    const result = validateRows([validRow, { ...validRow }]);
    expect(result.invalidRows).toHaveLength(1);
    expect(result.invalidRows[0].errors[0]).toContain("ana_id 重复");
  });
});
