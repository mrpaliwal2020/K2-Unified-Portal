# K2 Unified Portal Instructions

K2 Unified Portal is an independently deployed React/Vite client in the K2
Unified System. It shares K2 API contracts, domain vocabulary, design-token
meaning, and trust rules with the backend and mobile app, but it does not import
their code or share their release lifecycle.

## System boundaries

- Read `docs/decisions/ADR-001-two-experience-portal-boundary.md` and
  `docs/decisions/ADR-002-backend-owned-capabilities-and-multi-unit-access.md`,
  `docs/decisions/ADR-003-hybrid-active-unit-context-and-elevated-audit.md`,
  and `docs/decisions/ADR-004-initial-unit-membership-roles.md`
  before changing portal boundaries, authenticated operations pages, unit
  context, roles, or authorization UX.
- Treat backend, mobile, and portal as independently deployable projects.
- The backend owns API contracts, authorization, business rules, data
  integrity, and audit behavior. Portal role checks and protected routes are
  user-experience controls, not an authorization boundary.
- Read `docs/data-contracts/` before changing an API consumer, entity shape,
  error handling, or compatibility behavior. Contracts must remain additive
  for live mobile and portal clients.
- Reuse the meaning of approved K2 design tokens across clients. Do not import
  files from the mobile project. The checked-in generated artifact at
  `src/styles/generated/k2-tokens.css` is the Portal's self-contained shared
  token input; verify its provenance in `design-tokens.lock.json`.

## Page and UI rules

- For every new or materially changed page, read
  `docs/portal-page-development-standard.md` and `docs/design-system.md`.
- Use `K2AsyncStateView` for asynchronous Operations-page states. Use
  `K2PortalPageLayout` when the applicable existing layout does not already
  provide the page heading, actions, and content frame.
- Use `K2DateField` for date-only inputs and `K2ReferenceSelect` for
  feature-owned reference data; do not introduce another date/select library
  without a documented need.
- Read `docs/architecture/portal-time-core.md` before adding date parsing or
  formatting. Use `src/core/time/k2Date.js`; never parse a date-only API value
  with `new Date("YYYY-MM-DD")`.
- Read `docs/architecture/portal-upload-core.md` before adding a file upload.
  Use `uploadK2File`; save its CDN URL only after the presigned PUT succeeds.
- Read `docs/architecture/portal-read-cache-and-connectivity.md` before
  adding browser caching or offline behavior. Use cached data only for reads;
  do not queue Portal writes offline.
- Reuse `src/components/ui`, layouts, `src/tokens`, and existing common
  components before adding a page-local design system or another UI library.
- For localized UI, use `useLocalizedDomain("<backend-domain>")` and
  `t("stable.key", "English fallback")`. Do not hard-code a closed list of
  backend domains or use visible English sentences as translation keys; read
  `docs/data-contracts/localization.md`.
- Every data page must explicitly render loading, content, empty, API-error,
  unauthorized, and relevant limited-connectivity/retry states.
- Do not log or expose Firebase tokens, personal/contact data, financial data,
  farm/location data, or full sensitive API payloads.

## Engineering rules

- Route application API traffic through `src/services/api/`; reuse module
  endpoint/API files and `services/utils/errorHandler.js`.
- Read `docs/architecture/portal-http-core.md` before changing an API
  consumer. Use `ApiFailure` and `assertSuccessfulEnvelope`; never represent
  API or transport failure as an empty successful result.
- Preserve the existing React, route, auth, context, Zustand, and component
  patterns unless a documented decision approves a change.
- Keep API calls, storage access, and side effects outside render paths.
- Use `ROUTES` and the route configuration for durable navigation; avoid
  unregistered hard-coded application routes.
- Browser configuration is public build-time configuration only. Never commit
  credentials or rely on browser code to keep a secret.
- Run focused `npm run lint`, `npm test`, and `npm run build` for relevant
  Portal changes. Add focused component and accessibility coverage when a
  shared UI primitive gains behavior.

## Change discipline

- Do not rewrite unchanged pages merely to apply a standard; apply standards to
  new work and pages receiving a functional change.
- Record consequential portal/backend contract, token, authentication, or
  design-system decisions in `docs/decisions/`.
- Treat the current deployment workflow as production-affecting. Do not modify
  deployment, Firebase, or server configuration without an approved rollout
  and rollback plan.
