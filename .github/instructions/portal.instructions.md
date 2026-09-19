---
applyTo: "**/*.{js,jsx}"
---

# K2 Portal React Rules

- Read `docs/portal-page-development-standard.md` before creating or materially
  changing a page.
- Use existing layouts, `src/components/ui`, and `src/tokens` before creating
  local component systems, arbitrary colors, typography, spacing, or a new UI
  dependency.
- Keep components focused on rendering and user intent. Route async work
  through the established API modules, hooks, contexts, or stores.
- Use the shared API client and module endpoints; do not duplicate axios
  configuration, token attachment, API error mapping, or endpoint strings in
  page components.
- Render loading, content, empty, error, unauthorized, and retry states
  deliberately. Never show a failed write as a successful update.
- Use route constants/configuration for application navigation. Frontend role
  checks do not grant access; backend authorization remains required.
- Do not put secrets in `VITE_*` configuration, local storage, console logs,
  telemetry, or source code.
- Use semantic HTML and accessible labels, keyboard interactions, focus
  behavior, and responsive layouts.
