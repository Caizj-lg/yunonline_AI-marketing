import { describe, expect, it } from "vitest";
import demoEvidence from "../data/demo-evidence.json";
import { searchEvidence } from "../lib/evidence-search";

describe("evidence search", () => {
  it("returns 20 records from the first page", () => {
    const result = searchEvidence(demoEvidence, {}, 1, 20);

    expect(result.rows).toHaveLength(20);
    expect(result.total).toBe(400);
    expect(result.totalPages).toBe(20);
    expect(result.page).toBe(1);
  });

  it("filters submitted conditions and safely clamps pages", () => {
    const result = searchEvidence(demoEvidence, { platform: "豆包" }, 99, 20);

    expect(result.total).toBe(100);
    expect(result.totalPages).toBe(5);
    expect(result.page).toBe(5);
    expect(result.rows).toHaveLength(20);
    expect(result.rows.every((row) => row.platform === "豆包")).toBe(true);
  });
});
