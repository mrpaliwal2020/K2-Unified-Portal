import { apiPost } from "../../client/apiClient";
import { BUY_SELL_ENDPOINT, BUY_SELL_OPS } from "./buySell.endpoints";

// ─── Get Unit Items (Store) ───────────────────────────────────────────────────
export const getUnitItems = async (unitCode) => {
  const result = await apiPost(BUY_SELL_ENDPOINT, BUY_SELL_OPS.GET_PRODUCT, {
    unitCode,
  });
  if (result.success && result.data?.userList?.length > 0)
    return result.data.userList;
  return [];
};
