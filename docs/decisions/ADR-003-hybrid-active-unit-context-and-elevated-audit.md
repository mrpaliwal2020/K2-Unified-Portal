# ADR-003: Hybrid active-unit context and elevated-action audit

**Status:** Accepted  
**Date:** 2026-09-19

## Context

Profiles may operate in multiple business units/FPOs. Operations pages need a
convenient default context, while durable links, browser restoration, and K2
staff work may need to name a specific unit. Limited K2 global administration
also requires stronger accountability than ordinary scoped work.

## Decision

- The portal remembers a valid active business unit as the default context.
- A route-level unit identifier may override the remembered unit when the
  backend confirms the profile/capability is authorized for that unit.
- If no valid unit context remains, the portal takes the user to unit
  selection and preserves the intended route where safe to do so.
- Every global-administration action requires a reason and writes an audit
  event containing actor, target profile/unit, capability, timestamp, reason,
  and before/after values where applicable.

## Consequences

- The backend context contract must return memberships, effective
  capabilities, active-unit validity, and an authorization error shape.
- The portal may remember a selection for usability but never treats stored
  unit/profile IDs as authority.
- Operations API and UI work must distinguish normal scoped actions from
  elevated global actions.
