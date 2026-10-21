import { describe, expect, it } from "vitest";
import demoEvidence from "../data/demo-evidence.json";
import { getEvidenceFiltersFromParams, getPaginationItems, searchEvidence } from "../lib/evidence-search";

describe("evidence search", () => {
  it("returns 20 records from the first page", () => {
    const result = searchEvidence(demoEvidence, {}, 1, 20);

    expect(result.rows).toHaveLength(20);
    expect(result.total).toBe(480);
    expect(result.totalPages).toBe(24);
    expect(result.page).toBe(1);
  });

  it("filters submitted conditions and safely clamps pages", () => {
    const result = searchEvidence(demoEvidence, { platform: "豆包" }, 99, 20);

    expect(result.total).toBe(120);
    expect(result.totalPages).toBe(6);
    expect(result.page).toBe(6);
    expect(result.rows).toHaveLength(20);
    expect(result.rows.every((row) => row.platform === "豆包")).toBe(true);
  });

  it("shows only the first and last three pages with an ellipsis", () => {
    expect(getPaginationItems(20)).toEqual([1, 2, 3, "ellipsis", 18, 19, 20]);
    expect(getPaginationItems(6)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("restores URL filters and falls back to the latest batch", () => {
    const params = new URLSearchParams({ batch: "missing", platform: "豆包", brand: "云帆" });
    const filters = getEvidenceFiltersFromParams(params, demoEvidence);

    expect(filters.batch).toBe("2026年6月复查");
    expect(filters.platform).toBe("豆包");
    expect(filters.brand).toBe("云帆");
  });
});
