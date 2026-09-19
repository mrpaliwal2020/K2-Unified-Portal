# Portal Design System

The portal currently has a local token layer in `src/tokens`, a theme layer,
shared components in `src/components/ui`, common components, and some
StandardK2-specific UI. Use the [Portal Page Development
Standard](portal-page-development-standard.md) for new or materially changed
pages.

Before introducing a shared component, confirm at least two real portal
consumers need the same behavior. Existing pages are migrated only when
receiving a functional change.

## Shared K2 token delivery

The Portal consumes a checked-in generated artifact at
`src/styles/generated/k2-tokens.css`. It is generated from the neutral source
in the Mobile repository, but the Portal build never reads the Mobile
repository. `design-tokens.lock.json` records the exact source commit and
hashes used by this Portal release.

Do not edit the generated CSS or duplicate its shared values in Portal token
files. Update the neutral source, regenerate its web CSS, and update this
artifact and lock file together in a Portal PR. Map existing Portal-specific
public-site and operations UI tokens to the shared `--k2-*` variables
incrementally when those components receive functional work.

Mobile-specific UI details and Portal-specific component, responsive, public,
and operations tokens remain owned by their respective applications.

## Operations page primitives

Use these on new or materially changed authenticated Operations pages:

- `K2PortalPageLayout` provides the standard page heading, actions, and content
  spacing when an existing dashboard layout does not already provide them.
- `K2AsyncStateView` provides the required loading, content, refreshing, empty,
  error, unauthorized, offline, and offline-with-cached-data states.
- `K2DateField` uses the browser's accessible date-only input and emits the
  stable `YYYY-MM-DD` value expected by date-only API fields. Do not create a
  JavaScript `Date` merely to submit a date-only value.
- `K2ReferenceSelect` provides an accessible native select for typed
  reference-data options, including loading, empty, disabled, hint, and error
  states. Options must come from the feature's approved API or static domain
  vocabulary, not a page-local duplicate list.
- `src/pages/Units/Units.jsx` is the current reference adoption. It preserves
  its unit-selector UX while surfacing retrieval failure with a retry action.

These generic form primitives are placeholders until their first reference
form adoption. Do not add a second date/select library solely to anticipate
future forms.

## Adoption and enforcement

Apply these standards only to new pages or pages receiving functional changes;
do not bulk-rewrite legacy Portal UI. Production build validation is required,
while full-repository lint enforcement remains deferred until the existing lint
baseline is remediated. `npm test` runs component and axe-core accessibility
checks for the shared primitives; add a focused test whenever a primitive gains
a new state or behavior.
