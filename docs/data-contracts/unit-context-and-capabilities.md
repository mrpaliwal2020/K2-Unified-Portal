# Unit Context and Capabilities Contract

**Status:** Proposed V1  
**Consumers:** K2 Unified Backend, K2 Unified Mobile, K2 Unified Portal

## Purpose

The authenticated context tells a client who the active profile is, which
business units/FPOs they may operate in, which unit is active, and which
backend-authorized capabilities apply to that context.

The backend validates every operation. The portal and mobile use this contract
only to compose navigation and user experience.

## Context shape

The exact API envelope is backend-owned. Each client needs equivalent data:

```text
profile
  profileId
  displayName

memberships[]
  unitId / unitCode
  membershipId
  roleCodes[]
  capabilities[]
  status
  staffScope?              // for K2 staff assignments

activeUnit
  unitId / unitCode
  selectedAt

contextVersion
expiresAt
```

The client may remember `activeUnit` for convenience. A route unit ID can
override it only after backend validation. If membership is absent, suspended,
or expired, the client removes the active selection and sends the user to unit
selection.

## Proposed V1 capability registry

| Capability | Meaning | Initial role bundle |
| --- | --- | --- |
| `unit.view` | View authorized unit details | All unit roles; scoped K2 staff |
| `unit.edit` | Change authorized unit operational details | Unit administrator, director |
| `unit.configure_functions` | Select/configure unit functions | Unit administrator, director |
| `member.view` | View authorized members | Unit administrator, director, accountant, promoter; scoped K2 staff |
| `member.invite` | Invite or initiate a member addition | Unit administrator, director, promoter |
| `member.edit` | Update member operational details | Unit administrator, director, promoter |
| `member.approve` | Approve pending membership | Unit administrator, director |
| `member.suspend` | Suspend/restore a membership | Unit administrator, director |
| `member.assign_role` | Change member role bundle | Unit administrator |
| `reports.unit.view` | View unit operational reports | Unit administrator, director, accountant; scoped K2 staff |
| `support.assigned.view` | View K2-assigned support scope | Scoped K2 staff |
| `support.assigned.act` | Perform K2 support actions in assigned scope | Scoped K2 staff |
| `admin.global.act` | Perform explicitly elevated global administration | K2 global administrator |
| `public.content.manage` | Publish approved public portal content | K2 public-content manager |

`member` begins with self-service/view capabilities only. Finance, compliance,
marketplace, and service capabilities are intentionally outside this first
matrix and must be added as their domains are designed.

## Elevated global actions

For every `admin.global.act` operation, the request/audit record must include:

```text
actorProfileId
targetProfileId? / targetUnitId?
capability
reason
timestamp
beforeValue? / afterValue?
requestId
```

The backend rejects an elevated action with no reason or insufficient
capability. Clients must show the required-reason input and a clear failure
state.

## Required backend behavior

- Resolve profile, membership, active-unit membership, staff scope, and
  capability server-side for every protected request.
- Return a stable unauthorized/forbidden error shape; do not return an empty
  data list for denied access.
- Audit role assignment, membership approval/suspension, unit configuration,
  and elevated global administration.
- Make contract changes additive; do not rename/remove fields or make a
  previously optional field required without compatibility planning.
