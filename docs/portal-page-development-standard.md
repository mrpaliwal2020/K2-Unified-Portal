# K2 Portal Page Development Standard

Apply this to every new page and material page change. K2 Unified Portal is a
web client in the K2 Unified System; it shares API contract and design-token
meaning with K2 mobile where applicable, while remaining independently built,
deployed, and versioned.

## Fast page flow

1. Identify the user, role, and outcome.
2. Confirm the existing API module and language-neutral contract.
3. Reuse the portal's existing layout, UI component, and token layers.
4. Render the full async-state model through `K2AsyncStateView` where data is
   loaded asynchronously.
5. Validate responsive, keyboard, and role behavior before release.

## Required baseline

| Concern | Portal standard |
| --- | --- |
| Page frame | Reuse `DashboardLayout`, `AuthLayout`, the applicable StandardK2/common layout, and `K2PortalPageLayout` for an Operations-page heading/action/content frame |
| UI | Prefer `src/components/ui` and existing common components before creating a new component or adding a UI dependency |
| Tokens | Use `src/tokens` and theme semantics; do not duplicate raw palette/type/spacing values in page code |
| Routes | Add or use `ROUTES`/route configuration; do not scatter hard-coded application routes |
| API | Use `src/services/api/client/apiClient.js` and the relevant module API/endpoint files |
| State | Use `K2AsyncStateView` for `loading`, `content`, `refreshing`, `empty`, `error`, `unauthorized`, `offline`, or `offlineWithCachedData`; feature code owns requests, data, and retry behavior |
| Authorization | Use protected routes/role checks for UX only; assume the backend makes the final authorization decision |
| Copy | Use `useLocalizedDomain` with a stable backend key and English fallback for localized UI; read `docs/data-contracts/localization.md` |
| Dates | Use `K2DateField` and `src/core/time/k2Date.js`; preserve date-only semantics and do not parse `YYYY-MM-DD` through the browser UTC parser |
| Accessibility | Use semantic HTML, labels, keyboard interaction, focus behavior, and responsive layouts |

For new or materially changed API consumers, use the failure contract in
`docs/architecture/portal-http-core.md`. An empty collection is valid only when
the backend successfully returns no records; network and backend failures must
reach the explicit error/retry state.

## Shared API and design-token policy

- API contracts are language-neutral and backend-owned. Portal and mobile may
  use the same endpoint and entity contract, but must not depend on each
  other's implementation files.
- A portal change must be additive and compatible with live mobile versions
  unless the backend contract documents a version/migration path.
- Token **meaning** must align across clients: primary, surface, text,
  destructive, spacing, radius, typography, breakpoints, and status roles.
- The Portal imports a checked-in generated shared-token artifact at
  `src/styles/generated/k2-tokens.css`; its exact origin is recorded in
  `design-tokens.lock.json`. Do not edit that artifact or import the Mobile
  repository at build time.

## Reference primitives

- `K2PortalPageLayout` provides a responsive Operations-page heading,
  description, action area, and consistently spaced content area.
- `K2AsyncStateView` standardizes asynchronous UI states while keeping data
  fetching, mutation, and retry logic inside the feature.
- Use `K2DateField` for date-only user input and submit its `YYYY-MM-DD` value
  without a browser-time-zone conversion.
- Use `K2ReferenceSelect` for feature-owned reference-data choices. Handle
  loading, empty, error, and disabled option states explicitly.
- Use existing `Button`, `Card`, `Input`, and `Loader` components before
  adding another component library. Build date and reference-data fields only
  when a real changing form needs them.
- Public website pages may use their established StandardK2 layouts. They must
  still meet responsive and accessibility requirements but are not forced into
  an Operations dashboard frame.

## Do not introduce

- Direct axios/API configuration or endpoint strings in a page component.
- Token, Firebase token, profile, farm, location, financial, or sensitive
  payload logging.
- A new UI library, styling system, state library, or localization mechanism
  for one page.
- Role-only authorization assumptions.
- Silent API failure, success-looking fallback, or browser-stored secrets.
- A portal deployment change without rollout and rollback planning.

## Current implementation priorities

1. Document authoritative API contracts shared with mobile under
   `docs/data-contracts/`.
2. Apply `K2PortalPageLayout` and `K2AsyncStateView` to one actively changing
   Operations page as the first reference implementation.
3. Add PR-triggered build validation before relying on deployment-only CI; make
   lint required after the existing legacy lint baseline is remediated.
4. Decide and document portal localization ownership.

## Copilot task starter

```text
MODE: IMPLEMENT
REPOSITORY: K2-Unified-Portal
AUTHORITATIVE CONTEXT:
- docs/portal-page-development-standard.md
- docs/data-contracts/<contract>
- <issue, API module, route, and existing page>
OUTCOME: <observable user/operations outcome>
IN SCOPE: <specific page, role, API module, route>
OUT OF SCOPE: <what must not change>
REQUIREMENTS:
- Reuse the portal UI/token/API patterns.
- Keep the backend as the authorization authority.
- Render loading, empty, error, unauthorized, and retry behavior.
- Preserve mobile/API compatibility.
VALIDATION: npm run lint && npm test && npm run build
```
