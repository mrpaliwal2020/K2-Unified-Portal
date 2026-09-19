import apiClient, { apiPost } from "../../client/apiClient";
import {
  PROFILES_ENDPOINTS,
  LEGACY_PROFILE_ENDPOINT,
  LEGACY_PROFILE_OPS,
} from "./profiles.endpoints";

// ═══════════════════════════════════════════════════════════════════
// ─── NEW profiles API ─────────────────────────────────────────────
// Response shape: { success, message, data, meta }
// ═══════════════════════════════════════════════════════════════════

// ─── Get Profile (by mobile) ──────────────────────────────────────────────────
// GET /k2uApi/profiles/?mobileNumber=...
// Profile na mile to backend 404 deta hai → null return (register flow ke liye).
export const getProfile = async (mobileNumber) => {
  try {
    const { data } = await apiClient.get(PROFILES_ENDPOINTS.LOOKUP, {
      params: { mobileNumber },
    });
    if (data?.success && data?.data) return data.data;
    return null;
  } catch (error) {
    return null;
  }
};

// ─── Get Profile (by id) ──────────────────────────────────────────────────────
// GET /k2uApi/profiles/{profileId}/
export const getProfileById = async (profileId) => {
  try {
    const { data } = await apiClient.get(PROFILES_ENDPOINTS.DETAIL(profileId));
    if (data?.success && data?.data) return data.data;
    return null;
  } catch (error) {
    return null;
  }
};

// ─── Create Profile ───────────────────────────────────────────────────────────
// POST /k2uApi/profiles/create/
// Response data: { profileId, mobileNumber }
export const createProfile = async (profileData) => {
  try {
    const { data } = await apiClient.post(PROFILES_ENDPOINTS.CREATE, {
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      mobileNumber: profileData.mobileNumber,
      stateId: profileData.stateId,
      districtId: profileData.districtId,
      tehsilId: profileData.tehsilId,
      villageId: profileData.villageId,
      latitude: profileData.latitude || null,
      longitude: profileData.longitude || null,
      gender: profileData.gender || "N",
      mobileMasked: false,
      createdBy: profileData.mobileNumber,
    });
    if (data?.success) {
      return { success: true, data: data.data };
    }
    return {
      success: false,
      error: data?.message || "Profile create nahi hua",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.userMessage ||
        "Something went wrong",
    };
  }
};

// ═══════════════════════════════════════════════════════════════════
// ─── LEGACY (purana manageProfile API) ────────────────────────────
// ═══════════════════════════════════════════════════════════════════

// ─── Get Unit Details ─────────────────────────────────────────────────────────
export const getUnitDetails = async (unitCode, groupId) => {
  const result = await apiPost(
    LEGACY_PROFILE_ENDPOINT,
    LEGACY_PROFILE_OPS.UNIT_DETAILS,
    {
      unitCode,
      groupId,
    },
  );
  if (result.success && result.data?.userList?.length > 0) {
    return result.data.userList[0];
  }
  return null;
};

// ─── Create Record For Delete Account ─────────────────────────────────────────
// OTP verify hone ke baad user delete button dabata hai to yeh call hoti hai.
export const createRecordForDeleteAccount = async (mobileNumber) => {
  try {
    const { data } = await apiClient.post(LEGACY_PROFILE_ENDPOINT, {
      operation: LEGACY_PROFILE_OPS.CREATE_RECORD_FOR_DELETE_ACCOUNT,
      user: {
        mobileNumber,
      },
    });
    if (data?.result === "success") {
      return { success: true, data };
    }
    return {
      success: false,
      error: data?.message || "Delete request submit nahi hui",
    };
  } catch (error) {
    return {
      success: false,
      error: error.userMessage || "Something went wrong",
    };
  }
};
