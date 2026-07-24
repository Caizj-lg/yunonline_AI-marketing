import { describe, expect, it } from "vitest";
import { parseWorkbook } from "../lib/workbook-parser";

describe("parseWorkbook", () => {
  it("reads the supplied June review workbook without losing raw answers", async () => {
    const result = await parseWorkbook("/Users/zack/Downloads/260630六月底复查成效采集数据分析.xlsx");
    expect(result.validRows).toHaveLength(400);
    expect(result.invalidRows).toHaveLength(0);
    expect(new Set(result.validRows.map((row) => row.platform))).toEqual(
      new Set(["豆包", "DeepSeek", "元宝", "Kimi"]),
    );
    expect(result.validRows[0].answer.length).toBeGreaterThan(400);
  });
});
