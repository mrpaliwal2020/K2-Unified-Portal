import { apiPost } from "../../client/apiClient";
import {
  BUSINESS_UNIT_ENDPOINT,
  BUSINESS_UNIT_OPS,
} from "./businessUnit.endpoints";

// ─── Get FPO Directory ───────────────────────────────────────────────────────
// In-flight request dedup: same params concurrently → share one promise.
const _fpoInflight = new Map();

export const getFPODirectory = async ({
  cin = "",
  companyName = "",
  state = "",
  category = "",
  companyStatus = "",
} = {}) => {
  const key = JSON.stringify({ cin, companyName, state, category, companyStatus });
  if (_fpoInflight.has(key)) return _fpoInflight.get(key);

  const promise = (async () => {
    const result = await apiPost(
      BUSINESS_UNIT_ENDPOINT,
      BUSINESS_UNIT_OPS.GET_FPO_DIRECTORY,
      {
        cin,
        companyName,
        state,
        category,
        companyStatus,
      },
    );
    if (result.success && result.data?.fpoList?.length > 0) {
      return result.data.fpoList.map((f) => ({
        cin: f.cin,
        name: f.companyName,
        state: f.state || "",
        district: f.district || "",
        status: f.companyStatus || "Unknown",
        category: f.category || "",
        crops: f.crops || "",
        industry: f.industry || "",
        authorizedCapital: parseFloat(f.authorizedCapital) || 0,
        paidupCapital: parseFloat(f.paidupCapital) || 0,
        registrationDate: f.registrationDate || "",
        yearFounded: f.registrationDate
          ? new Date(f.registrationDate).getFullYear()
          : null,
        roc: f.roc || "",
        address: f.address || "",
        pinCode: f.pinCode || "",
        source: f.source || "",
        phone: f.phone || "",
        members: f.members || 0,
        eligibleSchemesCount: f.eligibleSchemesCount || 0,
        eligibleSchemes: f.eligibleSchemes || "",
        complianceEventsCount: f.complianceEventsCount || 0,
        nextCompliance: f.nextCompliance || "",
        nextComplianceType: f.nextComplianceType || "",
      }));
    }
    return [];
  })();

  _fpoInflight.set(key, promise);
  try {
    return await promise;
  } finally {
    _fpoInflight.delete(key);
  }
};

// ─── Get All FPO Nearby ───────────────────────────────────────────────────────
export const getAllBusinessUnits = async (latitude = "", longitude = "") => {
  const result = await apiPost(
    BUSINESS_UNIT_ENDPOINT,
    BUSINESS_UNIT_OPS.GET_ALL_BUSINESSUNITS,
    { latitude, longitude, unitType: "NA" },
  );
  return result.success ? result.data?.userlist || [] : [];
};

// ─── Get Farmer Land Info ─────────────────────────────────────────────────────
export const getFarmerLandInfo = async (profileId) => {
  const result = await apiPost(
    BUSINESS_UNIT_ENDPOINT,
    BUSINESS_UNIT_OPS.GET_LAND_INFO,
    {
      profileid: profileId,
    },
  );
  if (result.success && result.data?.userlist?.length > 0)
    return result.data.userlist;
  return [];
};

// ─── Get Farmer Assets ────────────────────────────────────────────────────────
export const getFarmerAssets = async (profileId) => {
  const result = await apiPost(
    BUSINESS_UNIT_ENDPOINT,
    BUSINESS_UNIT_OPS.GET_FARMER_ASSETS,
    {
      profileid: profileId,
    },
  );
  if (result.success && result.data?.userlist?.length > 0)
    return result.data.userlist;
  return [];
};

// ─── Get Farmer Livestock ─────────────────────────────────────────────────────
export const getFarmerLivestock = async (profileId) => {
  const result = await apiPost(
    BUSINESS_UNIT_ENDPOINT,
    BUSINESS_UNIT_OPS.GET_FARMER_LIVESTOCK,
    {
      profileid: profileId,
    },
  );
  if (result.success && result.data?.userlist?.length > 0)
    return result.data.userlist;
  return [];
};

// ─── Get Farmer Services ──────────────────────────────────────────────────────
export const getFarmerServices = async (profileId) => {
  const result = await apiPost(
    BUSINESS_UNIT_ENDPOINT,
    BUSINESS_UNIT_OPS.GET_FARMER_SERVICES,
    {
      profileid: profileId,
    },
  );
  if (result.success && result.data?.userlist?.length > 0)
    return result.data.userlist;
  return [];
};

// ─── Get Farmer Business ──────────────────────────────────────────────────────
export const getFarmerBusiness = async (profileId) => {
  const result = await apiPost(
    BUSINESS_UNIT_ENDPOINT,
    BUSINESS_UNIT_OPS.GET_FARMER_BUSINESS,
    {
      profileid: profileId,
    },
  );
  if (result.success && result.data?.userlist?.length > 0)
    return result.data.userlist;
  return [];
};

// ─── Get Unit Livestock Summary ───────────────────────────────────────────────
export const getUnitLivestockSummary = async (unitCode, groupId) => {
  const result = await apiPost(
    BUSINESS_UNIT_ENDPOINT,
    BUSINESS_UNIT_OPS.GET_UNIT_LIVESTOCK_SUMMARY,
    {
      user: { unitCode, groupId },
    },
  );
  if (result.success) return result.data;
  return null;
};

// ─── Get Unit Soil Report ─────────────────────────────────────────────────────
export const getUnitSoilReport = async (unitCode, groupId) => {
  const result = await apiPost(
    BUSINESS_UNIT_ENDPOINT,
    BUSINESS_UNIT_OPS.GET_UNIT_SOIL_REPORT,
    {
      unitCode,
      groupId,
    },
  );
  if (result.success) return result.data;
  return null;
};

// ─── Get Member Profile Report ────────────────────────────────────────────────
export const getMemberProfileReport = async (profileId, unitCode, groupId) => {
  const result = await apiPost(
    BUSINESS_UNIT_ENDPOINT,
    BUSINESS_UNIT_OPS.GET_MEMBER_PROFILE_REPORT,
    {
      profileId,
      unitCode,
      groupId,
    },
  );
  if (result.success) return result.data;
  return null;
};

// ─── Get Unit Land Records Summary ───────────────────────────────────────────
export const getUnitLandRecordsSummary = async (unitCode, groupId) => {
  const result = await apiPost(
    BUSINESS_UNIT_ENDPOINT,
    BUSINESS_UNIT_OPS.GET_UNIT_LAND_RECORDS_SUMMARY,
    {
      user: { unitCode, groupId },
    },
  );
  if (result.success) return result.data;
  return null;
};

// ─── Get Farmer Details ───────────────────────────────────────────────────────
export const getFarmerDetails = async (profileId, unitCode, groupId) => {
  const result = await apiPost(
    BUSINESS_UNIT_ENDPOINT,
    BUSINESS_UNIT_OPS.GET_FARMER_DETAILS,
    {
      profileId,
      unitCode,
      groupId,
    },
  );
  if (result.success && result.data?.userlist?.length > 0)
    return result.data.userlist;
  return [];
};

// ─── Get Crops In Farm ────────────────────────────────────────────────────────
export const getCropsInFarm = async (
  profileId,
  unitCode,
  groupId,
  farmId = null,
) => {
  const result = await apiPost(
    BUSINESS_UNIT_ENDPOINT,
    BUSINESS_UNIT_OPS.GET_CROPS_IN_FARM,
    {
      profileId,
      unitCode,
      groupId,
      ...(farmId && { farmId }),
    },
  );
  if (result.success && result.data?.userlist?.length > 0)
    return result.data.userlist;
  return [];
};

// ─── Get All Business Units Of User ──────────────────────────────────────────
export const getAllBusinessUnitsOfUser = async (profileId) => {
  const result = await apiPost(
    BUSINESS_UNIT_ENDPOINT,
    BUSINESS_UNIT_OPS.GET_ALL_BUSINESS_UNITS_OF_USER,
    {
      profileId,
    },
  );
  if (result.success && result.data?.userlist?.length > 0)
    return result.data.userlist;
  return [];
};

// ─── Get Unit Summary ─────────────────────────────────────────────────────────
export const getUnitSummary = async (unitCode, groupId, profileId) => {
  const result = await apiPost(
    BUSINESS_UNIT_ENDPOINT,
    BUSINESS_UNIT_OPS.GET_UNIT_SUMMARY,
    {
      unitCode,
      groupId,
      profileId,
    },
  );
  if (result.success && result.data?.unitSummary)
    return result.data.unitSummary;
  return null;
};
