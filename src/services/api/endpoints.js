// ─── All API Endpoint URLs ────────────────────────────────────────────────────
const ENDPOINTS = {
  // ── manageProfile ─────────────────────────────────────────────────────────
  PROFILE: `/k2kapi/manageProfile/`,

  // ── managek2App ───────────────────────────────────────────────────
  REGISTER: `/k2kapi/managek2App/`,

  // ── groupManagement ───────────────────────────────────────────────────
  GROUP_MANAGEMENT: `/k2kapi/groupManagement/`,

  // ── businessUnit ───────────────────────────────────────────────────
  BUSINESS_UNIT: `/k2kapi/businessUnit/`,
  
  

  // ── k2BuySell ───────────────────────────────────────────────────
  BUY_SELL: `/k2kapi/k2BuySell/`,

  // ── myFarm ───────────────────────────────────────────────────
  CROP_DATA: `/k2kapi/myFarm/`,

  // ── Posts ───────────────────────────────────────────────────
  GET_ISSUES: `/k2kapi/Posts/`,

  // ── News ───────────────────────────────────────────────────
  GET_NEWS: `/k2kapi/News/`,
  // ── myBusiness ───────────────────────────────────────────────────
  MY_BUSINESS: `/k2kapi/myBusiness/`,
 
    // ── myGoverment ───────────────────────────────────────────────────
  MY_GORERMENT: `/k2kapi/myGoverment/`,

  


};

// ─── All Operations ───────────────────────────────────────────────────────────
export const OPS = {
  // manageProfile
  GET_PROFILE: "getProfile",
  CREATE_PROFILE: "createProfile",
  UPDATE_PROFILE: "updateProfile",
  DELETE_PROFILE: "deleteProfile",
  UNIT_DETAILS: "getUnitDetails",

  // managek2App
  GET_STATE_DISTRICT: "getStateDistrictList",
  GET_VILLAGE_LIST: "getVillageList",

  // groupManagement
  GET_GROUP_LIST: "getAllGroupNearBy",
  GET_MEMBER_LIST: "getUnitMember",
  GET_GROUP_DEMAND_AVAILABILITY: "getGroupDemandAvailability",
  GET_GROUP_ACTIVITIES: "getGroupActivities",

  // businessUnit
  GET_LAND_INFO: "getFarmerLandInfo",
  GET_UNIT_SUMMARY: "getUnitSummary",
  GET_ALL_BUSINESSUNITS: "getAllBusinessUnits",
  GET_FPO_DIRECTORY: "getFPODirectory",

  // k2BuySell
  GET_PRODUCT: "getUnitItems",
  // myFarm
  GET_CROP_DETAILS: "getUnitSownAreaPerCropPerMember",

  // Posts
  GET_UNIT_ISSUES: "getPostListByUnit",

  // myBusiness — Stock
  ADD_STOCK_ITEM: "addStockItem",
  GET_STOCK_ITEMS: "getStockItems",
  EDIT_STOCK_ITEM: "editStockItem",
  DELETE_STOCK_ITEM: "deleteStockItem",

  // myBusiness — Collection
  ADD_COLLECTION: "addCollection",
  GET_COLLECTIONS: "getCollections",
  EDIT_COLLECTION: "editCollection",
  DELETE_COLLECTION: "deleteCollection",

  // myBusiness — Distribution
  ADD_DISTRIBUTION: "addDistribution",
  GET_DISTRIBUTIONS: "getDistributions",
  EDIT_DISTRIBUTION: "editDistribution",
  DELETE_DISTRIBUTION: "deleteDistribution",

  // agriPlan
  GET_AGRI_BUSINESS_PLAN: "getAgriBusinessPlan",

  // myGovernment — Programs
  GET_PROGRAM: "getProgram",
  GET_PROGRAM_ELIGIBILITY: "getProgramEligibility",
  GET_GROUP_BY_PROGRAM: "getGroupByProgram",
  GET_PROGRAM_DOCUMENT: "getProgramDocument",

  // myGovernment — User Program Documents
  CREATE_USER_PROGRAM_DOCUMENT: "createUserProgramDocument",
  UPDATE_USER_PROGRAM_DOCUMENT: "updateUserProgramDocument",
  GET_USER_PROGRAM_DOCUMENT: "getUserProgramDocument",

  // myGovernment — Document Files
  UPLOAD_PROGRAM_DOCUMENT_FILE: "uploadProgramDocumentFile",
  LIST_PROGRAM_DOCUMENT_FILES: "listProgramDocumentFiles",
  DELETE_PROGRAM_DOCUMENT_FILE: "deleteProgramDocumentFile",

  // myGovernment — Notifications
  GET_NOTIFICATIONS: "getNotifications",
  MARK_NOTIFICATION_READ: "markNotificationRead",

  // myGovernment — Calendar & Dashboard
  GET_CALENDAR_TASKS: "getCalendarTasks",
  GET_DASHBOARD_SUMMARY: "getDashboardSummary",
};

export default ENDPOINTS;
