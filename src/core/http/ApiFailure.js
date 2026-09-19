export const API_FAILURE_KIND = Object.freeze({
  api: "api",
  cancelled: "cancelled",
  conflict: "conflict",
  forbidden: "forbidden",
  network: "network",
  notFound: "not_found",
  parse: "parse",
  rateLimited: "rate_limited",
  server: "server",
  timeout: "timeout",
  unauthorized: "unauthorized",
  validation: "validation",
});

const DEFAULT_MESSAGES = {
  api: "The request could not be completed. Please try again.",
  cancelled: "The request was cancelled.",
  conflict: "This information changed. Refresh and try again.",
  forbidden: "You do not have permission to do this.",
  network: "Check your internet connection and try again.",
  not_found: "The requested information is no longer available.",
  parse: "We received an unexpected response. Please try again.",
  rate_limited: "Too many requests. Please try again shortly.",
  server: "Something went wrong on our side. Please try again.",
  timeout: "The server took too long to respond. Please try again.",
  unauthorized: "Your session has expired. Please sign in again.",
  validation: "Check the highlighted information and try again.",
};

export class ApiFailure extends Error {
  constructor({
    kind,
    message = DEFAULT_MESSAGES[kind] || DEFAULT_MESSAGES.api,
    status,
    code,
    requestId,
    fieldErrors = {},
    retryAfter,
    cause,
  }) {
    super(message, cause ? { cause } : undefined);
    this.name = "ApiFailure";
    this.kind = kind;
    this.status = status;
    this.code = code;
    this.requestId = requestId;
    this.fieldErrors = fieldErrors;
    this.retryAfter = retryAfter;
  }
}

const stringValue = (value) =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;

const messageFrom = (body) =>
  stringValue(body?.message) ||
  stringValue(body?.error) ||
  stringValue(body?.detail);

const fieldErrorsFrom = (value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value)
      .map(([field, message]) => [
        field,
        Array.isArray(message) ? message.join(" ") : String(message),
      ])
      .filter(([, message]) => message.trim()),
  );
};

const retryAfterFrom = (value) => {
  const seconds = Number(value);
  return Number.isFinite(seconds) && seconds >= 0 ? seconds : undefined;
};

const kindForStatus = (status, fieldErrors) => {
  if (fieldErrors && Object.keys(fieldErrors).length > 0) {
    return API_FAILURE_KIND.validation;
  }

  switch (status) {
    case 400:
    case 422:
      return API_FAILURE_KIND.validation;
    case 401:
      return API_FAILURE_KIND.unauthorized;
    case 403:
      return API_FAILURE_KIND.forbidden;
    case 404:
      return API_FAILURE_KIND.notFound;
    case 408:
      return API_FAILURE_KIND.timeout;
    case 409:
      return API_FAILURE_KIND.conflict;
    case 429:
      return API_FAILURE_KIND.rateLimited;
    default:
      return API_FAILURE_KIND.server;
  }
};

export const toApiFailure = (error) => {
  if (error instanceof ApiFailure) {
    return error;
  }

  if (error?.code === "ERR_CANCELED") {
    return new ApiFailure({
      kind: API_FAILURE_KIND.cancelled,
      cause: error,
    });
  }

  if (error?.code === "ECONNABORTED" || error?.code === "ETIMEDOUT") {
    return new ApiFailure({
      kind: API_FAILURE_KIND.timeout,
      cause: error,
    });
  }

  const response = error?.response;
  if (!response) {
    return new ApiFailure({
      kind: API_FAILURE_KIND.network,
      cause: error,
    });
  }

  const body = response.data;
  const fieldErrors = fieldErrorsFrom(body?.errors);
  const status = response.status;
  const kind = kindForStatus(status, fieldErrors);

  return new ApiFailure({
    kind,
    message: messageFrom(body) || DEFAULT_MESSAGES[kind],
    status,
    code: stringValue(body?.code),
    requestId:
      stringValue(body?.requestId) ||
      stringValue(response.headers?.["x-request-id"]),
    fieldErrors,
    retryAfter: retryAfterFrom(response.headers?.["retry-after"]),
    cause: error,
  });
};

export const assertSuccessfulEnvelope = (payload, operation) => {
  const result = payload?.result?.toString().toLowerCase();
  if (payload?.success === false || (result && result !== "success")) {
    throw new ApiFailure({
      kind: API_FAILURE_KIND.api,
      message: messageFrom(payload),
      code: stringValue(payload?.code) || result,
      requestId: stringValue(payload?.requestId),
      fieldErrors: fieldErrorsFrom(payload?.errors),
      cause: new Error(`Backend rejected ${operation}.`),
    });
  }

  return payload;
};
