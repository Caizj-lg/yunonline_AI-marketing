import { describe, expect, it } from "vitest";
import { isDemoCredential } from "../lib/demo-credentials";

describe("demo credentials", () => {
  it("accepts only the configured demo accounts", () => {
    expect(isDemoCredential("admin", "admin135")).toBe(true);
    expect(isDemoCredential("admin_01", "aigeo802274")).toBe(true);
    expect(isDemoCredential("admin", "incorrect-password")).toBe(false);
    expect(isDemoCredential("admin_01", "admin135")).toBe(false);
    expect(isDemoCredential("toString", "")).toBe(false);
  });
});
