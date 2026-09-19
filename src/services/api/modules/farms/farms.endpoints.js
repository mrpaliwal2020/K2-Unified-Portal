// ─── farms (new REST API, legacy myFarm) ──────────────────────────────────────
// Base: /k2uApi/farms/   (vite proxy → http://43.204.64.179)
//
//   POST/GET          /k2uApi/farms/?profileId=&unitId=&groupId=&status=&include=crops&page=&pageSize=
//   GET/PATCH/DELETE  /k2uApi/farms/{farmId}/
//   POST/GET          /k2uApi/farms/{farmId}/crops/?status=&include=activitySummary
//   POST              /k2uApi/farms/{farmId}/crop-schedules/
//   GET/PATCH/DELETE  /k2uApi/farms/farm-crops/{farmCropId}/
//   GET               /k2uApi/farms/crop-activity-schedules/?farmId=&terfourFunctionId=
//   POST              /k2uApi/farms/farm-crops/{farmCropId}/activities/from-schedule/
//   POST              /k2uApi/farms/farm-crops/{farmCropId}/activities/batch/
//   GET               /k2uApi/farms/farm-crops/{farmCropId}/activities/
//   GET/PATCH/DELETE  /k2uApi/farms/farm-crop-activities/{id}/
//   GET               /k2uApi/farms/reports/unit-sown-area/?unitId=&groupId=   getUnitSownAreaPerCropPerMember
//   POST/GET          /k2uApi/farms/farm-assets/?profileId=
//   GET/PATCH/DELETE  /k2uApi/farms/farm-assets/{id}/
//   POST/GET          /k2uApi/farms/farm-livestock/?profileId=
//   GET/PATCH/DELETE  /k2uApi/farms/farm-livestock/{id}/
export const FARMS_BASE = `/k2uApi/farms/`;

export const FARMS_ENDPOINTS = {
  // Farms
  LIST: FARMS_BASE, // ?profileId=
  DETAIL: (farmId) => `${FARMS_BASE}${farmId}/`,

  // Crops
  FARM_CROPS: (farmId) => `${FARMS_BASE}${farmId}/crops/`,
  FARM_CROP_SCHEDULES: (farmId) => `${FARMS_BASE}${farmId}/crop-schedules/`,
  FARM_CROP_DETAIL: (farmCropId) => `${FARMS_BASE}farm-crops/${farmCropId}/`,
  CROP_ACTIVITY_SCHEDULES: `${FARMS_BASE}crop-activity-schedules/`, // ?farmId=&terfourFunctionId=

  // Activities
  ACTIVITIES_FROM_SCHEDULE: (farmCropId) =>
    `${FARMS_BASE}farm-crops/${farmCropId}/activities/from-schedule/`,
  ACTIVITIES_BATCH: (farmCropId) =>
    `${FARMS_BASE}farm-crops/${farmCropId}/activities/batch/`,
  FARM_CROP_ACTIVITIES: (farmCropId) =>
    `${FARMS_BASE}farm-crops/${farmCropId}/activities/`,
  ACTIVITY_DETAIL: (activityId) =>
    `${FARMS_BASE}farm-crop-activities/${activityId}/`,

  // Reports
  UNIT_SOWN_AREA: `${FARMS_BASE}reports/unit-sown-area/`, // ?unitId=&groupId=

  // Assets / livestock
  FARM_ASSETS: `${FARMS_BASE}farm-assets/`,
  FARM_ASSET_DETAIL: (id) => `${FARMS_BASE}farm-assets/${id}/`,
  FARM_LIVESTOCK: `${FARMS_BASE}farm-livestock/`,
  FARM_LIVESTOCK_DETAIL: (id) => `${FARMS_BASE}farm-livestock/${id}/`,
};

// ─── LEGACY (purana myFarm) ───────────────────────────────────────────────────
// getAgriBusinessPlan abhi bhi purane API par hai. Naya endpoint:
// GET /k2uApi/units/agribusiness-plans/?unitId=&groupId=&unitProfileId=&planVersion=
export const LEGACY_FARM_ENDPOINT = `/k2kapi/myFarm/`;

export const LEGACY_FARM_OPS = {
  GET_AGRI_BUSINESS_PLAN: "getAgriBusinessPlan",
};
