import * as XLSX from "xlsx";
import { describe, expect, it } from "vitest";
import records from "../data/demo-evidence.json";
import { parseWorkbookBuffer } from "../lib/workbook-parser";

const yesNo = (value: boolean) => (value ? "是" : "否");

function buildDemoWorkbook() {
  const rows = records.map((row) => ({
    ana_id: row.anaId,
    AI平台: row.platform,
    问题: row.question,
    上传批次: row.batchName,
    AI输出的答案: row.answer,
    客户的优势是否明显: yesNo(row.advantageObvious),
    有利的关键词: row.positiveKeywords,
    不利的关键词: row.negativeKeywords,
    客户的排名是否为前三: yesNo(row.rankedTopThree),
    是否有提及目标客户: yesNo(row.mentionedTarget),
    是否有提及目标行业的品牌: yesNo(row.mentionedIndustryBrand),
    上传时间: row.collectedAt,
    ...Object.fromEntries(row.brands.map((brand, index) => [`品牌${index + 1}`, brand])),
  }));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), "Sheet1");
  return XLSX.write(workbook, { type: "array", bookType: "xlsx" }) as ArrayBuffer;
}

describe("parseWorkbook", () => {
  it("reads a workbook built from the demo seed without losing raw answers", () => {
    const result = parseWorkbookBuffer(buildDemoWorkbook());
    expect(result.invalidRows).toHaveLength(0);
    expect(result.validRows).toHaveLength(records.length);
    expect(new Set(result.validRows.map((row) => row.platform))).toEqual(
      new Set(["豆包", "DeepSeek", "元宝", "Kimi"]),
    );
    expect(result.validRows[0].answer).toBe(records[0].answer);
    expect(result.validRows[0].brandMentions).toEqual(records[0].brands);
  });
});
