import apiClient from "../../client/apiClient";
import { POSTS_ENDPOINT, POSTS_OPS } from "./posts.endpoints";

// ─── Get Unit Issues (IssueBox) ───────────────────────────────────────────────
export const getUnitIssues = async (unitCode) => {
  try {
    const { data } = await apiClient.post(POSTS_ENDPOINT, {
      operation: POSTS_OPS.GET_UNIT_ISSUES,
      user: { unitCode },
    });
    if (data?.data?.userList?.length > 0) return data.data.userList;
    return [];
  } catch (error) {
    return [];
  }
};
