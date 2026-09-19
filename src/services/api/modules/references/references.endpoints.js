// ─── references (new REST API, legacy managek2App) ────────────────────────────
// Base: /k2uApi/references/   (vite proxy → http://43.204.64.179)
//
//   GET /k2uApi/references/locations/districts/              getStateDistrictList
//   GET /k2uApi/references/locations/villages/?districtId=   getVillageList
//   GET /k2uApi/references/locations/nearest/?latitude=&longitude=
//   GET /k2uApi/references/functions/primary-secondary/
//   GET /k2uApi/references/functions/tertiary-fourth/?prisecFunctionId=
//   GET /k2uApi/references/crop-functions/
//   GET /k2uApi/references/functions/produce/
//   GET /k2uApi/references/support-content/
//   GET /k2uApi/references/activities/
//   GET /k2uApi/references/finance-types/
//   GET /k2uApi/references/enums/
//   GET /k2uApi/references/localization/texts/?domain=&locale=
//   POST /k2uApi/references/localization/missing/
export const REFERENCES_BASE = `/k2uApi/references/`;

export const REFERENCES_ENDPOINTS = {
  // Locations
  STATE_DISTRICTS: `${REFERENCES_BASE}locations/districts/`,
  VILLAGES: `${REFERENCES_BASE}locations/villages/`, // ?districtId=
  NEAREST_VILLAGES: `${REFERENCES_BASE}locations/nearest/`, // ?latitude=&longitude=

  // Functions
  PRIMARY_SECONDARY_FUNCTIONS: `${REFERENCES_BASE}functions/primary-secondary/`,
  TERTIARY_FOURTH_FUNCTIONS: `${REFERENCES_BASE}functions/tertiary-fourth/`, // ?prisecFunctionId=
  CROP_FUNCTIONS: `${REFERENCES_BASE}crop-functions/`,
  PRODUCE_FUNCTIONS: `${REFERENCES_BASE}functions/produce/`,

  // Misc
  SUPPORT_CONTENT: `${REFERENCES_BASE}support-content/`,
  ACTIVITIES: `${REFERENCES_BASE}activities/`,
  FINANCE_TYPES: `${REFERENCES_BASE}finance-types/`,
  ENUMS: `${REFERENCES_BASE}enums/`,
  LOCALIZED_TEXTS: `${REFERENCES_BASE}localization/texts/`, // ?domain=&locale=
  REPORT_MISSING_LOCALIZATION: `${REFERENCES_BASE}localization/missing/`,
};
