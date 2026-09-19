import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearSessionReadCache,
  fetchWithSessionReadCache,
} from "../sessionReadCache";

const key = "unit-list:test-profile";

beforeEach(() => {
  clearSessionReadCache(key);
});

describe("session read cache", () => {
  it("returns a fresh cached read without calling the network", async () => {
    const fetcher = vi.fn().mockResolvedValue([{ unitCode: "K2-001" }]);

    await fetchWithSessionReadCache({ fetcher, key, maxAgeMs: 60_000 });
    const result = await fetchWithSessionReadCache({
      fetcher,
      key,
      maxAgeMs: 60_000,
    });

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      data: [{ unitCode: "K2-001" }],
      isStale: false,
      source: "cache",
    });
  });

  it("returns stale cached data with an explicit failure when refresh fails", async () => {
    await fetchWithSessionReadCache({
      fetcher: vi.fn().mockResolvedValue([{ unitCode: "K2-001" }]),
      key,
      maxAgeMs: 0,
    });

    const result = await fetchWithSessionReadCache({
      fetcher: vi.fn().mockRejectedValue({ code: "ECONNABORTED" }),
      key,
      maxAgeMs: -1,
    });

    expect(result).toMatchObject({
      data: [{ unitCode: "K2-001" }],
      isStale: true,
      source: "cache",
    });
    expect(result.error.kind).toBe("timeout");
  });
});
