import { describe, expect, it } from "vitest";
import records from "../data/demo-evidence.json";

describe("demo evidence seed", () => {
  it("keeps all Excel records and their full source answers", () => {
    expect(records).toHaveLength(400);
    expect(new Set(records.map((row) => row.question))).toHaveLength(100);
    expect(new Set(records.map((row) => row.platform))).toEqual(new Set(["豆包", "元宝", "Kimi", "DeepSeek"]));
    expect(records.every((row) => row.answer.length > 400)).toBe(true);
  });
});
