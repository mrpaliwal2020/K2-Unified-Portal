import { apiPost } from "../../client/apiClient";
import { MY_BUSINESS_ENDPOINT, MY_BUSINESS_OPS } from "./myBusiness.endpoints";

// ═══════════════════════════════════════════════════════════════════
// ─── myBusiness — STOCK ───────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════

// ─── Add Stock Item ───────────────────────────────────────────────
export const addStockItem = async (
  groupId,
  unitCode,
  productName,
  unit,
  qty,
  rate,
) => {
  const result = await apiPost(
    MY_BUSINESS_ENDPOINT,
    MY_BUSINESS_OPS.ADD_STOCK_ITEM,
    {
      groupId,
      unitCode,
      productName,
      unit,
      qty,
      rate,
    },
  );
  return result.success && result.data?.result?.toLowerCase() === "success";
};

// ─── Get Stock Items ──────────────────────────────────────────────
export const getStockItems = async (groupId, unitCode) => {
  const result = await apiPost(
    MY_BUSINESS_ENDPOINT,
    MY_BUSINESS_OPS.GET_STOCK_ITEMS,
    {
      groupId,
      unitCode,
    },
  );
  if (result.success && result.data?.units?.length > 0) {
    return result.data.units.map((item) => ({
      id: item.stockId,
      name: item.productName,
      unit: item.unit,
      qty: parseFloat(item.qty),
      rate: parseFloat(item.rate),
    }));
  }
  return [];
};

// ─── Edit Stock Item ──────────────────────────────────────────────
export const editStockItem = async (stockId, productName, unit, qty, rate) => {
  const result = await apiPost(
    MY_BUSINESS_ENDPOINT,
    MY_BUSINESS_OPS.EDIT_STOCK_ITEM,
    {
      stockId,
      productName,
      unit,
      qty,
      rate,
    },
  );
  return result.success && result.data?.result?.toLowerCase() === "success";
};

// ─── Delete Stock Item ────────────────────────────────────────────
export const deleteStockItem = async (stockId) => {
  const result = await apiPost(
    MY_BUSINESS_ENDPOINT,
    MY_BUSINESS_OPS.DELETE_STOCK_ITEM,
    {
      stockId,
    },
  );
  return result.success && result.data?.result?.toLowerCase() === "success";
};

// ═══════════════════════════════════════════════════════════════════
// ─── myBusiness — COLLECTION ──────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════

// ─── Add Collection ───────────────────────────────────────────────
export const addCollection = async ({
  groupId,
  unitCode,
  stockId,
  profileId,
  productName,
  qty,
  unit,
  price,
  note,
}) => {
  const result = await apiPost(
    MY_BUSINESS_ENDPOINT,
    MY_BUSINESS_OPS.ADD_COLLECTION,
    {
      groupId,
      unitCode,
      stockId,
      profileId,
      productName,
      qty,
      unit,
      price,
      note: note || "",
    },
  );
  if (result.success && result.data?.result?.toLowerCase() === "success") {
    return { success: true, collectionId: result.data.collectionId };
  }
  return { success: false };
};

// ─── Get Collections ─────────────────────────────────────────────
export const getCollections = async (groupId, unitCode) => {
  const result = await apiPost(
    MY_BUSINESS_ENDPOINT,
    MY_BUSINESS_OPS.GET_COLLECTIONS,
    {
      groupId,
      unitCode,
    },
  );
  if (result.success && result.data?.collections?.length > 0) {
    return result.data.collections.map((c) => ({
      id: c.collectionId,
      itemId: c.stockId,
      itemName: c.productName,
      qty: parseFloat(c.qty),
      unit: c.unit,
      price: parseFloat(c.price),
      memberId: c.profileId,
      memberName: `${c.firstName} ${c.lastName}`.trim(),
      note: c.note || "",
      date: c.created_at,
    }));
  }
  return [];
};

// ─── Edit Collection ─────────────────────────────────────────────
export const editCollection = async (collectionId, qty, price, note) => {
  const result = await apiPost(
    MY_BUSINESS_ENDPOINT,
    MY_BUSINESS_OPS.EDIT_COLLECTION,
    {
      collectionId,
      qty,
      price,
      note: note || "",
    },
  );
  return result.success && result.data?.result?.toLowerCase() === "success";
};

// ─── Delete Collection ────────────────────────────────────────────
export const deleteCollection = async (collectionId) => {
  const result = await apiPost(
    MY_BUSINESS_ENDPOINT,
    MY_BUSINESS_OPS.DELETE_COLLECTION,
    {
      collectionId,
    },
  );
  return result.success && result.data?.result?.toLowerCase() === "success";
};

// ═══════════════════════════════════════════════════════════════════
// ─── myBusiness — DISTRIBUTION ────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════

// ─── Add Distribution ─────────────────────────────────────────────
export const addDistribution = async ({
  groupId,
  unitCode,
  stockId,
  profileId,
  productName,
  qty,
  unit,
  price,
  note,
}) => {
  const result = await apiPost(
    MY_BUSINESS_ENDPOINT,
    MY_BUSINESS_OPS.ADD_DISTRIBUTION,
    {
      groupId,
      unitCode,
      stockId,
      profileId,
      productName,
      qty,
      unit,
      price,
      note: note || "",
    },
  );
  if (result.success && result.data?.result?.toLowerCase() === "success") {
    return { success: true, distributionId: result.data.distributionId };
  }
  return { success: false };
};

// ─── Get Distributions ────────────────────────────────────────────
export const getDistributions = async (groupId, unitCode) => {
  const result = await apiPost(
    MY_BUSINESS_ENDPOINT,
    MY_BUSINESS_OPS.GET_DISTRIBUTIONS,
    {
      groupId,
      unitCode,
    },
  );
  if (result.success && result.data?.distributions?.length > 0) {
    return result.data.distributions.map((d) => ({
      id: d.distributionId,
      itemId: d.stockId,
      itemName: d.productName,
      qty: parseFloat(d.qty),
      unit: d.unit,
      price: parseFloat(d.price),
      memberId: d.profileId,
      memberName: `${d.firstname} ${d.lastname}`.trim(),
      note: d.note || "",
      date: d.created_at,
    }));
  }
  return [];
};

// ─── Edit Distribution ────────────────────────────────────────────
export const editDistribution = async ({
  distributionId,
  stockId,
  groupId,
  unitCode,
  qty,
  price,
  note,
}) => {
  const result = await apiPost(
    MY_BUSINESS_ENDPOINT,
    MY_BUSINESS_OPS.EDIT_DISTRIBUTION,
    {
      distributionId,
      stockId,
      groupId,
      unitCode,
      qty,
      price,
      note: note || "",
    },
  );
  return result.success && result.data?.result?.toLowerCase() === "success";
};

// ─── Delete Distribution ──────────────────────────────────────────
export const deleteDistribution = async (distributionId) => {
  const result = await apiPost(
    MY_BUSINESS_ENDPOINT,
    MY_BUSINESS_OPS.DELETE_DISTRIBUTION,
    {
      distributionId,
    },
  );
  return result.success && result.data?.result?.toLowerCase() === "success";
};
