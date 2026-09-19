import apiClient, { apiPost } from "../../client/apiClient";
import {
  FARMS_ENDPOINTS,
  LEGACY_FARM_ENDPOINT,
  LEGACY_FARM_OPS,
} from "./farms.endpoints";

// ═══════════════════════════════════════════════════════════════════
// ─── NEW farms API ────────────────────────────────────────────────
// Response shape: { success, message, data, meta }
// ═══════════════════════════════════════════════════════════════════

const pick = (row, ...keys) => {
  for (const k of keys) {
    const v = row?.[k];
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return undefined;
};

// Dashboard purane cropStats keys padhta hai: cropName, totalSownArea,
// totalMemberSown. Naye report row ko usi shape me laao (raw row bhi saath me).
export const normalizeSownAreaRow = (row = {}) => ({
  ...row,
  cropName: pick(
    row,
    "cropName",
    "cropNameSnapshot",
    "crop",
    "terfourFunctionName",
  ),
  cropVarietyName: pick(row, "cropVarietyName", "cropVarietySnapshot"),
  totalSownArea: Number(
    pick(row, "totalSownArea", "sownArea", "totalArea", "areaAcre") ?? 0,
  ),
  sownAreaUnit: pick(row, "sownAreaUnit", "areaUnit", "unit"),
  totalMemberSown: Number(
    pick(row, "totalMemberSown", "memberCount", "totalMembers", "members") ??
      0,
  ),
});

// ─── Get Unit Sown Area Report ────────────────────────────────────────────────
// GET /k2uApi/farms/reports/unit-sown-area/?unitId=&groupId=
// unitId required (backend 400 deta hai), groupId optional.
// Return: { items: normalized rows, unresolvedAreaRows } (meta se).
export const getUnitSownAreaReport = async (unitId, groupId) => {
  if (!unitId) return { items: [], unresolvedAreaRows: 0 };
  try {
    const params = { unitId };
    if (groupId) params.groupId = groupId;
    const { data } = await apiClient.get(FARMS_ENDPOINTS.UNIT_SOWN_AREA, {
      params,
    });
    if (data?.success && Array.isArray(data?.data)) {
      return {
        items: data.data.map(normalizeSownAreaRow),
        unresolvedAreaRows: data?.meta?.unresolvedAreaRows ?? 0,
      };
    }
    return { items: [], unresolvedAreaRows: 0 };
  } catch (error) {
    return { items: [], unresolvedAreaRows: 0 };
  }
};

// ─── Get Unit Sown Area Per Crop Per Member ───────────────────────────────────
// Purane myFarm `getUnitSownAreaPerCropPerMember` (POST, unitCode) ki jagah.
// Ab (unitId, groupId) leta hai aur sirf rows return karta hai.
export const getUnitSownAreaPerCropPerMember = async (unitId, groupId) => {
  const { items } = await getUnitSownAreaReport(unitId, groupId);
  return items;
};

// ─── Get Farms (by profile) ───────────────────────────────────────────────────
// GET /k2uApi/farms/?profileId=&unitId=&groupId=&status=&include=crops&page=&pageSize=
export const getFarms = async (profileId, options = {}) => {
  if (!profileId) return { items: [], total: 0 };
  try {
    const { data } = await apiClient.get(FARMS_ENDPOINTS.LIST, {
      params: { profileId, page: 1, pageSize: 50, ...options },
    });
    if (data?.success && Array.isArray(data?.data)) {
      return { items: data.data, total: data?.meta?.total ?? data.data.length };
    }
    return { items: [], total: 0 };
  } catch (error) {
    return { items: [], total: 0 };
  }
};

// ─── Get Farm Crops ───────────────────────────────────────────────────────────
// GET /k2uApi/farms/{farmId}/crops/?status=&include=activitySummary
export const getFarmCrops = async (farmId, options = {}) => {
  if (!farmId) return [];
  try {
    const { data } = await apiClient.get(FARMS_ENDPOINTS.FARM_CROPS(farmId), {
      params: { page: 1, pageSize: 50, ...options },
    });
    if (data?.success && Array.isArray(data?.data)) return data.data;
    return [];
  } catch (error) {
    return [];
  }
};

// ═══════════════════════════════════════════════════════════════════
// ─── LEGACY (purana myFarm API) ───────────────────────────────────
// ═══════════════════════════════════════════════════════════════════

// ─── Get Agri Business Plan ───────────────────────────────────────────────────
// TODO: GET /k2uApi/units/agribusiness-plans/ (units module) par move karna hai
// jab BusinessPlain unitId/groupId pass karne lage.
export const getAgriBusinessPlan = async (
  unitCode,
  unitProfileId,
  planVersion = "1.0",
) => {
  const result = await apiPost(
    LEGACY_FARM_ENDPOINT,
    LEGACY_FARM_OPS.GET_AGRI_BUSINESS_PLAN,
    {
      unitCode,
      unitProfileId,
      planVersion,
    },
  );
  if (result.success && result.data?.plans?.length > 0) {
    return result.data.plans[0];
  }
  return null;
};
