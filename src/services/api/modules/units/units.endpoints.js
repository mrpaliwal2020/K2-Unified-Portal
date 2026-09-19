// ─── units (new REST API, legacy businessFunction / unit operations) ──────────
// Base: /k2uApi/units/   (vite proxy → http://43.204.64.179)
//
//   GET    /k2uApi/units/catalog/?unitTypes=&layerType=&parentFunctionCode=   getBusinessUnitCatalog
//   GET    /k2uApi/units/catalog-setup/?unitId=&groupId=                     getUnitCatalogSetup
//   POST   /k2uApi/units/catalog-selections/                                 createUnitSelection
//   GET    /k2uApi/units/agribusiness-plans/?unitId=&groupId=&unitProfileId=&planVersion=
//   GET    /k2uApi/units/crop-input-aggregation/?unitCode=                   getCropInputUnitAggregation
//   GET    /k2uApi/units/farms/?profileId=&unitCode=                         getFarmDetailsForUnit
//   GET    /k2uApi/units/sown-area/?unitCode=   (unused — farms/reports/unit-sown-area/ use hota hai)
//   GET    /k2uApi/units/members/?groupId=&unitId=                           getUnitMember
//   GET    /k2uApi/units/members/prisec-functions/?groupId=&unitId=          getUnitMemberPriSecProfiles
//   GET    /k2uApi/units/members/terfour-functions/?groupId=&unitId=         getUnitMemberTriFourProfiles
//   GET    /k2uApi/units/groups/member-activities/?groupId=                  getUserGroups
//   GET    /k2uApi/units/groups/my-units/?mobileNumber=&profileId=           getMyUnits
//   PATCH  /k2uApi/units/group-join-requests/                                updateGroupJoinRequest
//   POST   /k2uApi/units/                                                    createUnitDetails
//   PATCH  /k2uApi/units/{unitId}/                                           updateUnitDetails
//   DELETE /k2uApi/units/{unitId}/                                           deleteUnitDetails
export const UNITS_BASE = `/k2uApi/units/`;

export const UNITS_ENDPOINTS = {
  // Catalog
  CATALOG: `${UNITS_BASE}catalog/`,
  CATALOG_SETUP: `${UNITS_BASE}catalog-setup/`,
  CATALOG_SELECTIONS: `${UNITS_BASE}catalog-selections/`,

  // Plans / farms / crops
  AGRIBUSINESS_PLANS: `${UNITS_BASE}agribusiness-plans/`,
  CROP_INPUT_AGGREGATION: `${UNITS_BASE}crop-input-aggregation/`,
  FARMS: `${UNITS_BASE}farms/`,
  SOWN_AREA: `${UNITS_BASE}sown-area/`,

  // Members
  MEMBERS: `${UNITS_BASE}members/`,
  MEMBER_PRISEC_FUNCTIONS: `${UNITS_BASE}members/prisec-functions/`,
  MEMBER_TERFOUR_FUNCTIONS: `${UNITS_BASE}members/terfour-functions/`,

  // Groups
  GROUP_MEMBER_ACTIVITIES: `${UNITS_BASE}groups/member-activities/`,
  MY_UNITS: `${UNITS_BASE}groups/my-units/`, // ?mobileNumber=&profileId=
  GROUP_JOIN_REQUESTS: `${UNITS_BASE}group-join-requests/`,

  // Business unit CRUD
  CREATE: UNITS_BASE,
  DETAIL: (unitId) => `${UNITS_BASE}${unitId}/`,
};
