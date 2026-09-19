# ADR-004: Initial unit-membership roles are backend assigned

**Status:** Accepted  
**Date:** 2026-09-19

## Decision

The initial Unit/FPO role bundles are:

- Unit Owner / Administrator
- Director / FPO leader
- Accountant / finance operator
- Promoter / field staff
- Member
- K2 scoped staff / support
- K2 global administrator
- K2 public-content manager

The backend's membership and staff-assignment records determine effective roles
and capabilities. The portal displays allowed actions but does not assign
authority through local role strings.

## Consequences

- API contracts expose capabilities in the authenticated context.
- Portal route and component checks consume capabilities, not role-name
  comparisons.
- K2 public-content manager is a public-website content capability, separate
  from Unit/FPO membership authority.
- The detailed initial matrix is proposed in
  `docs/data-contracts/unit-context-and-capabilities.md`; revise it through a
  decision record before the backend implements it.
