import apiClient from "../../client/apiClient";
import { UNITS_ENDPOINTS } from "./units.endpoints";

// Response shape: { success, message, data, meta }

// ─── Helpers ──────────────────────────────────────────────────────────────────
// Naya k2uApi camelCase hi deta hai, par purane pages legacy field names
// (memberProfileId, memberFirstName, ...) padhte hain. Yeh normalizer dono
// naming ko ek hi shape me laata hai taaki Member / Dashboard / Survey /
// Inventory bina change ke chalte rahein.
const pick = (row, ...keys) => {
  for (const k of keys) {
    const v = row?.[k];
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return undefined;
};

const splitName = (full = "") => {
  const parts = String(full).trim().split(/\s+/);
  return { first: parts[0] || "", last: parts.slice(1).join(" ") };
};

export const normalizeUnitMember = (row = {}) => {
  const fullName = pick(row, "memberName", "fullName", "name");
  const split = fullName ? splitName(fullName) : { first: "", last: "" };

  const isActive = pick(row, "isActive", "active");
  const rawStatus = pick(row, "memberStatus", "status");
  const memberStatus =
    rawStatus ??
    (isActive === true || isActive === "Y" || isActive === 1
      ? "Active"
      : isActive === false || isActive === "N" || isActive === 0
        ? "Inactive"
        : "Active");

  const crops = pick(row, "scheduledCropsName", "scheduledCrops", "crops");
  const scheduledCropsName = Array.isArray(crops)
    ? crops
        .map((c) => (typeof c === "string" ? c : c?.cropName || c?.name))
        .filter(Boolean)
        .join(",")
    : crops;

  return {
    ...row,
    memberId: pick(row, "memberId", "membershipId", "id"),
    memberProfileId: pick(row, "memberProfileId", "profileId", "profile_id"),
    memberFirstName:
      pick(row, "memberFirstName", "firstName", "first_name") ?? split.first,
    memberLastName:
      pick(row, "memberLastName", "lastName", "last_name") ?? split.last,
    memberMobile: pick(row, "memberMobile", "mobileNumber", "mobile", "phone"),
    memberStatus,
    memberTypePrimary: pick(row, "memberTypePrimary", "primaryType", "role"),
    memberTypeSecondary: pick(row, "memberTypeSecondary", "secondaryType"),
    managedBy: pick(row, "managedBy", "managedByName", "manager"),
    village: pick(row, "village", "villageName", "memberVillage"),
    scheduledCropsName,
    lastUpdateDate: pick(
      row,
      "lastUpdateDate",
      "lastUpdatedDate",
      "updatedAt",
      "createdAt",
    ),
    memberImageUrl: pick(
      row,
      "memberImageUrl",
      "profileImageUrl",
      "imageUrl",
      "image",
    ),
    groupId: pick(row, "groupId"),
    unitId: pick(row, "unitId"),
    unitCode: pick(row, "unitCode"),
  };
};

// Backend list ko { data: [...] } ya { data: { results: [...] } } dono
// tarah bhej sakta hai — dono handle.
const extractList = (data) => {
  if (!data?.success) return [];
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.data?.results)) return data.data.results;
  if (Array.isArray(data.data?.members)) return data.data.members;
  return [];
};

// ─── Get My Units ─────────────────────────────────────────────────────────────
// GET /k2uApi/units/groups/my-units/?mobileNumber=&profileId=
// Purane getProfile ke `unitDetails` ki jagah. Dono params required hain.
// Row: { unitId, unitCode, unitName, unitAddress, unitType, groupId, ownerProfileId,
//        isActive, unitDetails, memberMobile, memberTypePrimary, memberTypeSecondary,
//        managedBy, lastUpdateDate, ... }
export const getMyUnits = async (profileId, mobileNumber) => {
  try {
    const { data } = await apiClient.get(UNITS_ENDPOINTS.MY_UNITS, {
      params: { profileId, mobileNumber },
    });
    if (data?.success && Array.isArray(data?.data)) return data.data;
    return [];
  } catch (error) {
    return [];
  }
};

// ─── Get Unit Members ─────────────────────────────────────────────────────────
// GET /k2uApi/units/members/?groupId=&unitId=
// Purane groupManagement `getUnitMember` (POST, groupId + unitCode) ki jagah.
// groupId required hai (backend 400 deta hai), unitId optional — na ho to
// group ke saare members aate hain.
// Return: normalized rows (legacy keys: memberId, memberProfileId,
//         memberFirstName, memberLastName, memberMobile, memberStatus,
//         memberTypePrimary, memberTypeSecondary, managedBy, village,
//         scheduledCropsName, lastUpdateDate, memberImageUrl, ...)
export const getUnitMembers = async (groupId, unitId) => {
  if (!groupId) return [];
  try {
    const params = { groupId };
    if (unitId) params.unitId = unitId;
    const { data } = await apiClient.get(UNITS_ENDPOINTS.MEMBERS, { params });
    return extractList(data).map(normalizeUnitMember);
  } catch (error) {
    return [];
  }
};

// ─── Get Unit Members – Primary/Secondary function profiles ──────────────────
// GET /k2uApi/units/members/prisec-functions/?groupId=&unitId=
export const getUnitMemberPriSecProfiles = async (groupId, unitId) => {
  if (!groupId) return [];
  try {
    const params = { groupId };
    if (unitId) params.unitId = unitId;
    const { data } = await apiClient.get(
      UNITS_ENDPOINTS.MEMBER_PRISEC_FUNCTIONS,
      { params },
    );
    return extractList(data);
  } catch (error) {
    return [];
  }
};

// ─── Get Unit Members – Tertiary/Fourth function profiles ────────────────────
// GET /k2uApi/units/members/terfour-functions/?groupId=&unitId=
export const getUnitMemberTriFourProfiles = async (groupId, unitId) => {
  if (!groupId) return [];
  try {
    const params = { groupId };
    if (unitId) params.unitId = unitId;
    const { data } = await apiClient.get(
      UNITS_ENDPOINTS.MEMBER_TERFOUR_FUNCTIONS,
      { params },
    );
    return extractList(data);
  } catch (error) {
    return [];
  }
};
