import { describe, expect, it } from "vitest";
import { isDemoCredential } from "../lib/demo-credentials";

describe("demo credentials", () => {
  it("accepts only admin/admin135", () => {
    expect(isDemoCredential("admin", "admin135")).toBe(true);
    expect(isDemoCredential("admin", "incorrect-password")).toBe(false);
  });
});
