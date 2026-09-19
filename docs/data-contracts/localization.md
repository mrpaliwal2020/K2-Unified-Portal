# Localization Contract

## Ownership and scope

The backend owns K2 translation data. Mobile and Portal implement their own
clients and share only backend locale values, domain names, stable keys, and
translation governance.

Portal accepts any non-empty backend domain string; it does not maintain a
hard-coded complete domain list. The FPO directory is the reference consumer
of the `portal_public` domain.

Use existing business domains when the vocabulary is shared with Mobile:
`ops`, `function`, `crops`, `units`, `finance`, `activity`, and `Survey`.
Use `portal_public` only for Portal public-site UI and add a Portal operations
domain only when wording is genuinely Portal-specific.

## API

```text
GET /k2uApi/references/localization/texts/?domain=<domain>&locale=<locale>
```

Successful responses use the standard envelope:

```json
{
  "success": true,
  "data": [
    { "keyCode": "fpo.search.title", "textValue": "Check Your FPO's Eligibility" }
  ]
}
```

The Portal client calls this through `getLocalizedTexts`. It caches each
`locale + domain` map in session storage, renders English fallback text while a
domain loads, and keeps that fallback if the request fails or a key is absent.

## Portal usage

Wrap the app once with `LocalizationProvider`, then load a domain inside a
page or shared component:

```jsx
const { locale, setLocale, t } = useLocalizedDomain("portal_public");

return <h1>{t("fpo.search.title", "Check Your FPO's Eligibility")}</h1>;
```

Keys are stable dotted identifiers. Do not use visible English sentences as
keys. Every lookup must include a readable English fallback so a translation
gap never blanks the UI.

`LANGUAGES` currently exposes English (`en`) and Hindi (`hi`) in the Portal
selector. Add more backend-approved locale codes there as each language is
released.

## Data that is not UI copy

Do not translate server-owned FPO names, CIN values, locations, scheme names,
or other business records through Portal UI keys. They require their own
localized fields or reference-data contract where applicable.
