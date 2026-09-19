# ADR-001: Two experiences in one portal repository

**Status:** Accepted  
**Date:** 2026-09-19

## Context

K2 Unified Portal currently combines public K2 pages, FPO/public directory
content, authentication, and role-based operational dashboards. Public visitors
and authenticated FPO/K2 operations users have different security, navigation,
performance, content, analytics, and release needs.

## Decision

Keep one portal repository and deployment for now, but treat it as two explicit
experiences:

1. **Public K2 website** for visitors, partners, leads, public FPO content,
   policies, news, and approved public catalog/content.
2. **K2 Operations Portal** for authenticated FPO leaders/members and K2 staff
   to manage units, membership, and K2 administration.

Both use the backend's language-neutral API contracts and compatible K2 token
meaning. They do not import mobile code or share the mobile release lifecycle.

## Consequences

- Public and operations routes, layouts, page standards, analytics, and
  acceptance criteria remain distinct.
- The repository may later split into separate public-site and operations
  deployments if ownership, security posture, performance, or release cadence
  diverges enough to justify it.
- Do not perform a large folder or deployment rewrite now. Separate
  responsibilities incrementally as features receive functional work.
