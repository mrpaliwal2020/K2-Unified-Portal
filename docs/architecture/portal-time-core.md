# Portal Time Core

`src/core/time/k2Date.js` is the single source for K2 calendar-date behavior.

- `parseK2Date(value)` reads ISO date-only values and legacy K2
  `DD-MM-YYYY HH:mm:ss Weekday` values. It returns a local calendar date or
  `null`; the legacy time is intentionally ignored.
- `formatApiDate(value)` produces `YYYY-MM-DD` for date-only REST fields.
- `formatLegacyK2Date(value)` produces the legacy K2 wire representation only
  for endpoints that still require it.
- `formatK2DateShort`, `formatK2DateLong`, and `formatK2DateTime` use
  `Intl.DateTimeFormat` with the active locale.

Do not construct `new Date("YYYY-MM-DD")` for calendar-only fields. Browsers
parse that form as UTC, which can display the prior day for users west of UTC.
Use `K2DateField` for date-only input and pass its `YYYY-MM-DD` value through
`formatApiDate` only when normalization is required.

Legacy screens retain their existing formatters until they receive functional
work; migrate them incrementally rather than bulk-reformatting historical UI.
