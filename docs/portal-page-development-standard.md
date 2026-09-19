# K2 Portal Page Development Standard

Apply this to every new page and material page change. K2 Unified Portal is a
web client in the K2 Unified System; it shares API contract and design-token
meaning with K2 mobile where applicable, while remaining independently built,
deployed, and versioned.

## Fast page flow

1. Identify the user, role, and outcome.
2. Confirm the existing API module and language-neutral contract.
3. Reuse the portal's existing layout, UI component, and token layers.
4. Render loading, content, empty, error, unauthorized, and retry outcomes.
5. Validate responsive, keyboard, and role behavior before release.

## Required baseline

| Concern | Portal standard |
| --- | --- |
| Page frame | Reuse `DashboardLayout`, `AuthLayout`, or the applicable StandardK2/common layout |
| UI | Prefer `src/components/ui` and existing common components before creating a new component or adding a UI dependency |
| Tokens | Use `src/tokens` and theme semantics; do not duplicate raw palette/type/spacing values in page code |
| Routes | Add or use `ROUTES`/route configuration; do not scatter hard-coded application routes |
| API | Use `src/services/api/client/apiClient.js` and the relevant module API/endpoint files |
| State | Render loading, content, empty, API-error, unauthorized, and retry states deliberately |
| Authorization | Use protected routes/role checks for UX only; assume the backend makes the final authorization decision |
| Copy | Keep visible copy and error messages localization-ready; do not create a competing translation mechanism |
| Accessibility | Use semantic HTML, labels, keyboard interaction, focus behavior, and responsive layouts |

## Shared API and design-token policy

- API contracts are language-neutral and backend-owned. Portal and mobile may
  use the same endpoint and entity contract, but must not depend on each
  other's implementation files.
- A portal change must be additive and compatible with live mobile versions
  unless the backend contract documents a version/migration path.
- Token **meaning** must align across clients: primary, surface, text,
  destructive, spacing, radius, typography, breakpoints, and status roles.
- Token **code** remains project-owned today. Do not copy from the Flutter
  project at build time. Move to a shared generated token source only after a
  versioned source and delivery process are accepted.

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
2. Establish the portal component/token inventory and page reference examples.
3. Add PR-triggered build validation before relying on deployment-only CI; make
   lint required after the existing legacy lint baseline is remediated.
4. Decide and document portal localization ownership and the future shared
   design-token source.

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
VALIDATION: npm run lint && npm run build
```
