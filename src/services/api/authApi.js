import { apiPost } from "./apiClient";
import apiClient from "./apiClient";
import ENDPOINTS, { OPS } from "./endpoints";

// ─── Get Profile ──────────────────────────────────────────────────────────────
export const getProfile = async (mobileNumber) => {
  const result = await apiPost(ENDPOINTS.PROFILE, OPS.GET_PROFILE, {
    mobileNumber,
  });
  if (result.success && result.data?.userList?.length > 0) {
    return result.data.userList[0];
  }
  return null;
};

// ─── Get Unit Details ─────────────────────────────────────────────────────────
export const getUnitDetails = async (profileId, unitCode) => {
  const result = await apiPost(ENDPOINTS.PROFILE, OPS.UNIT_DETAILS, {
    profileId,
    unitCode,
  });
  if (result.success && result.data?.userList?.length > 0) {
    return result.data.userList[0];
  }
  return null;
};

// ─── Create Profile ───────────────────────────────────────────────────────────
export const createProfile = async (profileData) => {
  try {
    const { data } = await apiClient.post(ENDPOINTS.PROFILE, {
      operation: OPS.CREATE_PROFILE,
      user: {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        mobileNumber: profileData.mobileNumber,
        village: profileData.village || "",
        tehsil: profileData.tehsil || "",
        district: profileData.district || "",
        state: profileData.state || "",
        latitude: profileData.latitude || "",
        longitude: profileData.longitude || "",
        gender: "N",
        numberMasked: "NA",
        addedBy: profileData.mobileNumber,
      },
    });
    if (data?.result === "success") {
      return { success: true, data };
    }
    return {
      success: false,
      error: data?.message || "Profile create nahi hua",
    };
  } catch (error) {
    return {
      success: false,
      error: error.userMessage || "Something went wrong",
    };
  }
};

// ─── Get State & District List ────────────────────────────────────────────────
export const getStateDistrictList = async () => {
  try {
    const { data } = await apiClient.post(ENDPOINTS.REGISTER, {
      operation: OPS.GET_STATE_DISTRICT,
    });
    if (data?.result === "success" && data?.userList) return data.userList;
    return [];
  } catch (error) {
    return [];
  }
};

// ─── Get Village List ─────────────────────────────────────────────────────────
export const getVillageList = async (state, district) => {
  try {
    const { data } = await apiClient.post(ENDPOINTS.REGISTER, {
      operation: OPS.GET_VILLAGE_LIST,
      state,
      district,
    });
    if (data?.result === "success" && data?.userList) return data.userList;
    return [];
  } catch (error) {
    return [];
  }
};

// ─── Get All FPO Nearby ───────────────────────────────────────────────────────
export const getAllBusinessUnits = async (latitude = "", longitude = "") => {
  const result = await apiPost(
    ENDPOINTS.BUSINESS_UNIT,
    OPS.GET_ALL_BUSINESSUNITS,
    { latitude, longitude, unitType: "NA" },
  );
  return result.success ? result.data?.userlist || [] : [];
};

// ─── Get Unit Members ────────────────────────────────────────────────────────
export const getUnitMembers = async (groupId, unitCode) => {
  const result = await apiPost(
    ENDPOINTS.GROUP_MANAGEMENT,
    OPS.GET_MEMBER_LIST,
    {
      groupId,
      unitCode,
    },
  );
  if (result.success && result.data?.userList?.length > 0)
    return result.data.userList;
  return [];
};

// ─── Get Farmer Land Info ─────────────────────────────────────────────────────
export const getFarmerLandInfo = async (profileId) => {
  const result = await apiPost(ENDPOINTS.BUSINESS_UNIT, OPS.GET_LAND_INFO, {
    profileid: profileId,
  });
  if (result.success && result.data?.userlist?.length > 0)
    return result.data.userlist;
  return [];
};

// ─── Get Unit Items (Store) ───────────────────────────────────────────────────
export const getUnitItems = async (unitCode) => {
  const result = await apiPost(ENDPOINTS.BUY_SELL, OPS.GET_PRODUCT, {
    unitCode,
  });
  if (result.success && result.data?.userList?.length > 0)
    return result.data.userList;
  return [];
};

// ─── Get Crop Details ─────────────────────────────────────────────────────────
export const getUnitSownAreaPerCropPerMember = async (unitCode) => {
  const result = await apiPost(ENDPOINTS.CROP_DATA, OPS.GET_CROP_DETAILS, {
    unitCode,
  });
  if (result.success && result.data?.response?.cropStats?.length > 0) {
    return result.data.response.cropStats;
  }
  return [];
};

// ─── Get Unit Issues (IssueBox) ───────────────────────────────────────────────
export const getUnitIssues = async (unitCode) => {
  try {
    const { data } = await apiClient.post(ENDPOINTS.GET_ISSUES, {
      operation: OPS.GET_UNIT_ISSUES,
      user: { unitCode },
    });
    if (data?.data?.userList?.length > 0) return data.data.userList;
    return [];
  } catch (error) {
    return [];
  }
};

// ─── Get Group Demand & Availability ─────────────────────────────────────────
export const getGroupDemandAvailability = async (groupId) => {
  const result = await apiPost(
    ENDPOINTS.GROUP_MANAGEMENT,
    OPS.GET_GROUP_DEMAND_AVAILABILITY,
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
  const result = await apiPost(
    ENDPOINTS.GROUP_MANAGEMENT,
    OPS.GET_GROUP_ACTIVITIES,
    {
      groupId,
    },
  );
  if (result.success && result.data?.userList?.length > 0)
    return result.data.userList;
  return [];
};

// ─── Get Unit Summary ─────────────────────────────────────────────────────────
export const getUnitSummary = async (unitCode, groupId, profileId) => {
  const result = await apiPost(ENDPOINTS.BUSINESS_UNIT, OPS.GET_UNIT_SUMMARY, {
    unitCode,
    groupId,
    profileId,
  });
  if (result.success && result.data?.unitSummary)
    return result.data.unitSummary;
  return null;
};

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
  const result = await apiPost(ENDPOINTS.MY_BUSINESS, OPS.ADD_STOCK_ITEM, {
    groupId,
    unitCode,
    productName,
    unit,
    qty,
    rate,
  });
  return result.success && result.data?.result?.toLowerCase() === "success";
};

// ─── Get Stock Items ──────────────────────────────────────────────
export const getStockItems = async (groupId, unitCode) => {
  const result = await apiPost(ENDPOINTS.MY_BUSINESS, OPS.GET_STOCK_ITEMS, {
    groupId,
    unitCode,
  });
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
  const result = await apiPost(ENDPOINTS.MY_BUSINESS, OPS.EDIT_STOCK_ITEM, {
    stockId,
    productName,
    unit,
    qty,
    rate,
  });
  return result.success && result.data?.result?.toLowerCase() === "success";
};

// ─── Delete Stock Item ────────────────────────────────────────────
export const deleteStockItem = async (stockId) => {
  const result = await apiPost(ENDPOINTS.MY_BUSINESS, OPS.DELETE_STOCK_ITEM, {
    stockId,
  });
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
  const result = await apiPost(ENDPOINTS.MY_BUSINESS, OPS.ADD_COLLECTION, {
    groupId,
    unitCode,
    stockId,
    profileId,
    productName,
    qty,
    unit,
    price,
    note: note || "",
  });
  if (result.success && result.data?.result?.toLowerCase() === "success") {
    return { success: true, collectionId: result.data.collectionId };
  }
  return { success: false };
};

// ─── Get Collections ─────────────────────────────────────────────
export const getCollections = async (groupId, unitCode) => {
  const result = await apiPost(ENDPOINTS.MY_BUSINESS, OPS.GET_COLLECTIONS, {
    groupId,
    unitCode,
  });
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
  const result = await apiPost(ENDPOINTS.MY_BUSINESS, OPS.EDIT_COLLECTION, {
    collectionId,
    qty,
    price,
    note: note || "",
  });
  return result.success && result.data?.result?.toLowerCase() === "success";
};

// ─── Delete Collection ────────────────────────────────────────────
export const deleteCollection = async (collectionId) => {
  const result = await apiPost(ENDPOINTS.MY_BUSINESS, OPS.DELETE_COLLECTION, {
    collectionId,
  });
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
  const result = await apiPost(ENDPOINTS.MY_BUSINESS, OPS.ADD_DISTRIBUTION, {
    groupId,
    unitCode,
    stockId,
    profileId,
    productName,
    qty,
    unit,
    price,
    note: note || "",
  });
  if (result.success && result.data?.result?.toLowerCase() === "success") {
    return { success: true, distributionId: result.data.distributionId };
  }
  return { success: false };
};

// ─── Get Distributions ────────────────────────────────────────────
export const getDistributions = async (groupId, unitCode) => {
  const result = await apiPost(ENDPOINTS.MY_BUSINESS, OPS.GET_DISTRIBUTIONS, {
    groupId,
    unitCode,
  });
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
  const result = await apiPost(ENDPOINTS.MY_BUSINESS, OPS.EDIT_DISTRIBUTION, {
    distributionId,
    stockId,
    groupId,
    unitCode,
    qty,
    price,
    note: note || "",
  });
  return result.success && result.data?.result?.toLowerCase() === "success";
};

// ─── Delete Distribution ──────────────────────────────────────────
export const deleteDistribution = async (distributionId) => {
  const result = await apiPost(ENDPOINTS.MY_BUSINESS, OPS.DELETE_DISTRIBUTION, {
    distributionId,
  });
  return result.success && result.data?.result?.toLowerCase() === "success";
};

// ═══════════════════════════════════════════════════════════════════
// ─── Agri Business Plan ───────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════

// ─── Get Agri Business Plan ───────────────────────────────────────
export const getAgriBusinessPlan = async (
  unitCode,
  unitProfileId,
  planVersion = "1.0",
) => {
  const result = await apiPost(
    ENDPOINTS.CROP_DATA,
    OPS.GET_AGRI_BUSINESS_PLAN,
    {
      unitCode,
      unitProfileId,
      planVersion,
    },
  );
  if (result.success && result.data?.plans?.length > 0) {
    return result.data.plans[0];
  }
  return null;
};
