import { describe, expect, it } from "vitest";
import records from "../data/demo-evidence.json";

describe("demo evidence seed", () => {
  it("ships a fixed fictional dataset across three review batches", () => {
    expect(records).toHaveLength(480);
    expect(new Set(records.map((row) => row.question))).toHaveLength(40);
    expect(new Set(records.map((row) => row.batchName))).toHaveLength(3);
    expect(new Set(records.map((row) => row.platform))).toEqual(new Set(["豆包", "元宝", "Kimi", "DeepSeek"]));
    expect(records.every((row) => row.answer.length > 200)).toBe(true);
  });
});
