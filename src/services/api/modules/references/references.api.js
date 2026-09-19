import apiClient from "../../client/apiClient";
import { assertSuccessfulEnvelope } from "../../../../core/http/ApiFailure";
import { REFERENCES_ENDPOINTS } from "./references.endpoints";

// Response shape: { success, message, data, meta }
// Reference lists read-only hain; khali list valid result hai, error nahi.

// ─── Get State & District List ────────────────────────────────────────────────
// GET /k2uApi/references/locations/districts/
// Row: { districtId, stateId, state, stateHindi, district, districtHindi, latitude, longitude }
export const getStateDistrictList = async () => {
  try {
    const { data } = await apiClient.get(REFERENCES_ENDPOINTS.STATE_DISTRICTS);
    if (data?.success && Array.isArray(data?.data)) return data.data;
    return [];
  } catch {
    return [];
  }
};

// ─── Get Village List ─────────────────────────────────────────────────────────
// GET /k2uApi/references/locations/villages/?districtId=
// Row: { villageId, tehsilId, village, tehsil, villageHindi, tehsilHindi, latitude, longitude, pincode }
export const getVillageList = async (districtId) => {
  try {
    const { data } = await apiClient.get(REFERENCES_ENDPOINTS.VILLAGES, {
      params: { districtId },
    });
    if (data?.success && Array.isArray(data?.data)) return data.data;
    return [];
  } catch {
    return [];
  }
};

export const getLocalizedTexts = async ({ domain, locale }) => {
  const { data } = await apiClient.get(REFERENCES_ENDPOINTS.LOCALIZED_TEXTS, {
    params: { domain, locale },
  });
  const response = assertSuccessfulEnvelope(data, "getLocalizedTexts");
  if (!Array.isArray(response.data)) {
    throw new Error("The localization service returned an invalid response.");
  }
  return response.data;
};
