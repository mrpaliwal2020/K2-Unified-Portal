# Portal Target Architecture and Action Plan

## Target shape

```text
K2 Unified Portal repository and deployment
|
|-- Public K2 website
|   |-- public routes, content, FPO directory, lead/partner journeys
|   |-- public layout, public performance/SEO/content analytics
|
|-- K2 Operations Portal
    |-- authenticated routes, unit context, capability-based navigation
    |-- FPO/unit operations, member management, K2 staff administration
    |-- operations layout, audit-aware actions, operational analytics
```

This is an architecture boundary, not an immediate directory move. Existing
`StandardK2` and dashboard paths should migrate only when their feature changes.

## Shared foundations

| Foundation | Owner | Portal action |
| --- | --- | --- |
| API contracts and server authorization | Backend | Document client contracts in `docs/data-contracts/`; do not duplicate rules in pages |
| Identity, active profile, and active unit | Backend with mobile/portal consumers | Define one context response and unit-switch behavior |
| Token meaning | K2 platform | Keep portal token code local; align semantic roles with mobile |
| Public copy/content | Product/content owner | Define publication, localization, legal review, and rollback workflow |
| Observability and audit | Platform/backend | Define safe portal events and audit-relevant operations |

## Delivery sequence

### 1. Establish the operations context contract

Document a backend contract for portal and mobile consumers:

- authenticated profile identity;
- memberships and available business units;
- current/active unit;
- roles and effective capabilities for that unit;
- staff assignment scope and explicit global capabilities;
- context version, expiry/refresh behavior, and unauthorized response.

Do this before adding new protected operations pages. It replaces scattered role
assumptions with one server-validated context.

### 2. Normalize portal API outcomes

Current module APIs often turn a failed request into `[]` or `null`. That makes
"no records" indistinguishable from "the API failed."

Define and adopt an incremental result convention for new/changed modules:

```text
loading | success(data) | empty | unauthorized | failure(error, retryable)
```

Use the shared API client and error mapper. Preserve existing module behavior
until its consumer is changed, then migrate it with explicit page states.

### 3. Establish UI/token inventory and reference pages

Inventory current portal token sources, custom UI components, MUI, Radix, and
Tailwind usage. Then choose reference pages:

- Public: home/content/FPO directory.
- Operations: unit overview, member list/detail, member form, K2 admin queue.

Public pages may optimize for narrative, discovery, responsive SEO, and lead
actions. Operations pages optimize for clear data, role-aware actions,
validation, status, auditability, and efficient desktop/tablet use.

Do not consolidate UI libraries or redesign all pages before this inventory.

### 4. Protect delivery before production deployment

The current workflow deploys on `main` and has no pull-request validation.
Add a non-deploying PR workflow first:

```text
npm ci
npm run build
```

Make those status checks required before merge. Keep deployment as a separate
post-merge job with an explicit rollback/runbook. The first ESLint baseline
contains 125 legacy findings (114 errors, 11 warnings), so `npm run lint`
remains a developer/PR review command until that baseline is remediated
incrementally. Add it as a required CI gate only after the baseline plan is
accepted. Add focused test tooling after the first reference pages define
practical test boundaries.

### 5. Incremental route and feature migration

For every changed feature:

1. Classify it as public or operations.
2. Confirm its contract and capability requirements.
3. Use the portal page-development standard.
4. Add explicit page states and safe error behavior.
5. Move route/layout ownership only where necessary.
6. Validate responsive and keyboard use plus API compatibility with mobile.

## Immediate decisions still required

1. Review and accept, revise, or split the proposed V1 unit-membership
   capability matrix in `docs/data-contracts/unit-context-and-capabilities.md`.
2. Public content owner and publication workflow: who may update public pages,
   directory details, policies, and claims.
3. Portal localization scope: English/Hindi launch behavior, translation owner,
   and source of truth.
4. Deployment environments: development, staging, production URLs; approval,
   monitoring, and rollback ownership.
