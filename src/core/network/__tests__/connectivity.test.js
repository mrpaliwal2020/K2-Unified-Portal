import { describe, expect, it, vi } from "vitest";
import {
  isBrowserOnline,
  subscribeToBrowserConnectivity,
} from "../connectivity";

describe("browser connectivity", () => {
  it("notifies subscribers when browser connectivity changes", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToBrowserConnectivity(listener);

    window.dispatchEvent(new Event("offline"));
    window.dispatchEvent(new Event("online"));
    unsubscribe();

    expect(listener).toHaveBeenCalledTimes(2);
    expect(isBrowserOnline()).toBeTypeOf("boolean");
  });
});
