# ADR-002: Backend-owned capabilities and multi-unit access

**Status:** Accepted  
**Date:** 2026-09-19

## Context

K2 users may operate across multiple business units/FPOs, and K2 staff need a
mix of assigned scope and limited elevated administration. Fixed frontend roles
cannot safely express all permissions or serve as the authorization authority.

## Decision

- The backend owns authorization and returns capabilities for the authenticated
  profile and active unit context.
- A profile may have different roles/capabilities in multiple units/FPOs.
- The portal uses capabilities and active-unit context to compose navigation
  and hide unavailable actions; it never grants access on its own.
- K2 staff are scoped to assigned regions, units, or cases by default. A small
  explicitly audited global-administration capability may be granted where
  necessary.

## Consequences

- Add or document one authoritative identity/context contract before expanding
  operations pages.
- Every operations API request must be server-scoped to authenticated profile,
  active unit, and capability; client-provided unit/profile identifiers are
  inputs to validate, not authority.
- Unit switching, unauthorized state, audit events, and role/capability changes
  need consistent behavior across mobile and portal.
