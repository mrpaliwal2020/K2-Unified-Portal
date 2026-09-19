// ─── myGoverment ──────────────────────────────────────────────────────────────
export const GOVERNMENT_ENDPOINT = `/k2kapi/myGoverment/`;

export const GOVERNMENT_OPS = {
  // Programs
  GET_PROGRAM: "getProgram",
  GET_PROGRAM_ELIGIBILITY: "getProgramEligibility",
  GET_GROUP_BY_PROGRAM: "getGroupByProgram",
  GET_PROGRAM_DOCUMENT: "getProgramDocument",

  // User Program Documents
  CREATE_USER_PROGRAM_DOCUMENT: "createUserProgramDocument",
  UPDATE_USER_PROGRAM_DOCUMENT: "updateUserProgramDocument",
  GET_USER_PROGRAM_DOCUMENT: "getUserProgramDocument",

  // Document Files
  UPLOAD_PROGRAM_DOCUMENT_FILE: "uploadProgramDocumentFile",
  LIST_PROGRAM_DOCUMENT_FILES: "listProgramDocumentFiles",
  DELETE_PROGRAM_DOCUMENT_FILE: "deleteProgramDocumentFile",

  // Notifications
  GET_NOTIFICATIONS: "getNotifications",
  MARK_NOTIFICATION_READ: "markNotificationRead",

  // Calendar & Dashboard
  GET_CALENDAR_TASKS: "getCalendarTasks",
  GET_DASHBOARD_SUMMARY: "getDashboardSummary",
};
