import { apiPost } from "../../client/apiClient";
import { GROUP_ENDPOINT, GROUP_OPS } from "./group.endpoints";

// ─── Get Unit Members ────────────────────────────────────────────────────────
// MOVED → modules/units/units.api.js → getUnitMembers(groupId, unitId)
// (GET /k2uApi/units/members/?groupId=&unitId=). Yahan se hata diya taaki
// barrel (services/api/index.js) me naam clash na ho.

// ─── Get Group Demand & Availability ─────────────────────────────────────────
export const getGroupDemandAvailability = async (groupId) => {
  const result = await apiPost(
    GROUP_ENDPOINT,
    GROUP_OPS.GET_GROUP_DEMAND_AVAILABILITY,
    {
      groupId,
    },
  );
  if (result.success && result.data?.userList?.length > 0)
    return result.data.userList;
  return [];
};

// ─── Get Group Activities ─────────────────────────────────────────────────────
export const getGroupActivities = async (groupId) => {
  const result = await apiPost(GROUP_ENDPOINT, GROUP_OPS.GET_GROUP_ACTIVITIES, {
    groupId,
  });
  if (result.success && result.data?.userList?.length > 0)
    return result.data.userList;
  return [];
};
