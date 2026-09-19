// ─── profiles (new REST API) ──────────────────────────────────────────────────
// Base: /k2uApi/profiles/   (vite proxy → http://43.204.64.179)
//
//   POST   /k2uApi/profiles/create/                  createProfile
//   GET    /k2uApi/profiles/?mobileNumber=98...      getProfile (by mobile)
//   GET    /k2uApi/profiles/{profileId}/             getProfile (by id)
//   PATCH  /k2uApi/profiles/{profileId}/             updateProfile
//   DELETE /k2uApi/profiles/{profileId}/             deleteProfile
//   DELETE /k2uApi/profiles/{profileId}/full/        deleteProfileFull
//   PATCH  /k2uApi/profiles/{profileId}/mobile-number/
export const PROFILES_BASE = `/k2uApi/profiles/`;

export const PROFILES_ENDPOINTS = {
  CREATE: `${PROFILES_BASE}create/`,
  LOOKUP: PROFILES_BASE, // ?mobileNumber=
  DETAIL: (profileId) => `${PROFILES_BASE}${profileId}/`,
  FULL_DELETE: (profileId) => `${PROFILES_BASE}${profileId}/full/`,
  MOBILE_NUMBER: (profileId) => `${PROFILES_BASE}${profileId}/mobile-number/`,
};

// ─── LEGACY (purana manageProfile) ────────────────────────────────────────────
// getUnitDetails / createRecordForDeleteAccount abhi bhi purane API par hain.
// Jab inke naye endpoints aayenge, tab yeh hata denge.
export const LEGACY_PROFILE_ENDPOINT = `/k2kapi/manageProfile/`;

export const LEGACY_PROFILE_OPS = {
  UNIT_DETAILS: "getUnitDetails",
  CREATE_RECORD_FOR_DELETE_ACCOUNT: "createRecordForDeleteAccount",
};
