# Portal HTTP Core

## Purpose

`src/core/http/ApiFailure.js` is the Portal's single failure model for API
calls. It distinguishes network, timeout, cancelled, unauthorized, forbidden,
not-found, validation, conflict, rate-limited, server, parse, and backend
business failures.

Each failure can carry a backend status, code, request ID, field errors, and
retry delay. UI must show the safe `message`; diagnostic fields are for
support, controlled logging, and field validation.

## Usage

- Route requests through `src/services/api/client/apiClient.js`.
- Use `assertSuccessfulEnvelope(payload, operation)` when an endpoint returns
  a backend success envelope.
- New or materially changed API functions must throw or return an explicit
  `ApiFailure`; they must not turn transport/API failure into `[]`, `{}`, or
  `null`.
- A valid empty server response remains an empty collection. It is not an
  error.
- `apiPost` preserves legacy caller compatibility with
  `{ success, data, error, failure }`, where `failure` is an `ApiFailure` on
  failure.

`Units` is the first migrated Operations flow: failure of either required unit
request renders the retryable page error rather than an empty unit selector.

## Incremental migration

Legacy API modules still contain success-shaped fallback returns. Convert them
when their feature changes; do not bulk-rewrite them. Begin with an endpoint's
read path, update its page to render an explicit error/retry state, then
migrate its mutations and field-error handling.
