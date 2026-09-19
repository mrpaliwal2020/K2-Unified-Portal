import { describe, expect, it } from "vitest";
import {
  API_FAILURE_KIND,
  ApiFailure,
  assertSuccessfulEnvelope,
  toApiFailure,
} from "../ApiFailure";

describe("ApiFailure", () => {
  it("preserves backend validation details", () => {
    const failure = toApiFailure({
      response: {
        status: 422,
        data: {
          code: "VALIDATION_ERROR",
          message: "Validation failed.",
          requestId: "request-123",
          errors: { mobileNumber: ["Enter a valid number."] },
        },
        headers: {},
      },
    });

    expect(failure).toBeInstanceOf(ApiFailure);
    expect(failure.kind).toBe(API_FAILURE_KIND.validation);
    expect(failure.fieldErrors).toEqual({
      mobileNumber: "Enter a valid number.",
    });
    expect(failure.requestId).toBe("request-123");
  });

  it("maps timeout and cancelled requests distinctly", () => {
    expect(toApiFailure({ code: "ECONNABORTED" }).kind).toBe(
      API_FAILURE_KIND.timeout,
    );
    expect(toApiFailure({ code: "ERR_CANCELED" }).kind).toBe(
      API_FAILURE_KIND.cancelled,
    );
  });

  it("turns a failed success-envelope payload into an explicit failure", () => {
    expect(() => assertSuccessfulEnvelope({
      success: false,
      code: "UNIT_ACCESS_DENIED",
      message: "This unit is not available.",
    }, "getMyUnits")).toThrow(ApiFailure);
  });
});
