import { describe, expect, it } from "vitest";
import {
  formatApiDate,
  formatK2DateShort,
  formatLegacyK2Date,
  parseK2Date,
} from "../k2Date";

describe("K2 date utilities", () => {
  it("parses date-only API values without a UTC date shift", () => {
    const date = parseK2Date("2026-01-05");

    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(0);
    expect(date.getDate()).toBe(5);
  });

  it("reads the legacy K2 date format and ignores its non-semantic time", () => {
    const date = parseK2Date("12-11-2026 15:30:00 Thursday");

    expect(formatApiDate(date)).toBe("2026-11-12");
    expect(formatLegacyK2Date(date)).toBe("12-11-2026 00:00:00 Thursday");
  });

  it("rejects invalid dates and formats valid dates with the requested locale", () => {
    expect(parseK2Date("31-02-2026")).toBeNull();
    expect(formatApiDate("invalid")).toBe("");
    expect(formatK2DateShort("2026-11-12", "en-IN")).toContain("2026");
  });
});
