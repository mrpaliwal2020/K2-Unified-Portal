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
