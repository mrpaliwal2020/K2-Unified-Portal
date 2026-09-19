// ─── groupManagement ──────────────────────────────────────────────────────────
export const GROUP_ENDPOINT = `/k2kapi/groupManagement/`;

export const GROUP_OPS = {
  GET_GROUP_LIST: "getAllGroupNearBy",
  // GET_MEMBER_LIST "getUnitMember" → ab units module (GET /k2uApi/units/members/)
  GET_GROUP_DEMAND_AVAILABILITY: "getGroupDemandAvailability",
  GET_GROUP_ACTIVITIES: "getGroupActivities",
};
