import apiClient, { apiPost } from "../../client/apiClient";
import { GOVERNMENT_ENDPOINT, GOVERNMENT_OPS } from "./government.endpoints";

// ═══════════════════════════════════════════════════════════════════
// ─── myGovernment — PROGRAMS ──────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════

// ─── Get Program ──────────────────────────────────────────────────
export const getProgram = async (state, language, programType = "") => {
  const result = await apiPost(GOVERNMENT_ENDPOINT, GOVERNMENT_OPS.GET_PROGRAM, {
    programType,
    state,
    language,
  });
  if (result.success && result.data?.userList?.length > 0)
    return result.data.userList;
  return [];
};

// ─── Get Program Eligibility ──────────────────────────────────────
export const getProgramEligibility = async (programId) => {
  const result = await apiPost(
    GOVERNMENT_ENDPOINT,
    GOVERNMENT_OPS.GET_PROGRAM_ELIGIBILITY,
    { programId },
  );
  if (result.success && result.data?.eligibilityList?.length > 0)
    return result.data.eligibilityList;
  return [];
};

// ─── Get Group By Program ─────────────────────────────────────────
export const getGroupByProgram = async (programId) => {
  const result = await apiPost(
    GOVERNMENT_ENDPOINT,
    GOVERNMENT_OPS.GET_GROUP_BY_PROGRAM,
    { programId },
  );
  if (result.success && result.data?.userList?.length > 0)
    return result.data.userList;
  return [];
};

// ─── Get Program Document ─────────────────────────────────────────
export const getProgramDocument = async (programId) => {
  const result = await apiPost(
    GOVERNMENT_ENDPOINT,
    GOVERNMENT_OPS.GET_PROGRAM_DOCUMENT,
    { programId },
  );
  if (result.success && result.data?.userList?.length > 0)
    return result.data.userList;
  return [];
};

// ═══════════════════════════════════════════════════════════════════
// ─── myGovernment — USER PROGRAM DOCUMENTS ────────────────────────
// ═══════════════════════════════════════════════════════════════════

// ─── Create User Program Document ─────────────────────────────────
export const createUserProgramDocument = async (documentData) => {
  try {
    const { data } = await apiClient.post(GOVERNMENT_ENDPOINT, {
      operation: GOVERNMENT_OPS.CREATE_USER_PROGRAM_DOCUMENT,
      user: {
        profileId: documentData.profileId,
        documentId: documentData.documentId,
        documentName: documentData.documentName,
        documentType: documentData.documentType,
        documentStatus: documentData.documentStatus || "NEW",
        documentCriteria: documentData.documentCriteria,
        documentDetails: documentData.documentDetails,
        programId: documentData.programId,
        programName: documentData.programName,
        dueDate: documentData.dueDate,
        groupId: documentData.groupId,
        unitCode: documentData.unitCode,
        notes: documentData.notes || "",
      },
    });
    if (data?.result === "success") {
      return { success: true, message: data.message };
    }
    return {
      success: false,
      error: data?.message || "Failed to create document",
    };
  } catch (error) {
    return {
      success: false,
      error: error.userMessage || "Something went wrong",
    };
  }
};

// ─── Update User Program Document ─────────────────────────────────
export const updateUserProgramDocument = async (documentData) => {
  try {
    const { data } = await apiClient.post(GOVERNMENT_ENDPOINT, {
      operation: GOVERNMENT_OPS.UPDATE_USER_PROGRAM_DOCUMENT,
      user: {
        id: documentData.id,
        profileId: documentData.profileId,
        documentId: documentData.documentId,
        documentName: documentData.documentName,
        documentType: documentData.documentType,
        documentStatus: documentData.documentStatus,
        documentCriteria: documentData.documentCriteria,
        documentDetails: documentData.documentDetails,
        programId: documentData.programId,
        programName: documentData.programName,
        dueDate: documentData.dueDate,
        notes: documentData.notes || "",
      },
    });
    if (data?.result === "success") {
      return { success: true, message: data.message };
    }
    return {
      success: false,
      error: data?.message || "Failed to update document",
    };
  } catch (error) {
    return {
      success: false,
      error: error.userMessage || "Something went wrong",
    };
  }
};

// ─── Get User Program Document ────────────────────────────────────
export const getUserProgramDocument = async (profileId, groupId, unitCode) => {
  const result = await apiPost(
    GOVERNMENT_ENDPOINT,
    GOVERNMENT_OPS.GET_USER_PROGRAM_DOCUMENT,
    { profileId, groupId, unitCode },
  );
  if (result.success && result.data?.userList?.length > 0)
    return result.data.userList;
  return [];
};

// ═══════════════════════════════════════════════════════════════════
// ─── myGovernment — DOCUMENT FILES ────────────────────────────────
// ═══════════════════════════════════════════════════════════════════

// ─── Upload Program Document File ─────────────────────────────────
export const uploadProgramDocumentFile = async (fileData) => {
  try {
    const { data } = await apiClient.post(GOVERNMENT_ENDPOINT, {
      operation: GOVERNMENT_OPS.UPLOAD_PROGRAM_DOCUMENT_FILE,
      user: {
        userProgramDocumentId: fileData.userProgramDocumentId,
        fileName: fileData.fileName,
        fileUrl: fileData.fileUrl,
        mimeType: fileData.mimeType,
        sizeKb: fileData.sizeKb,
        uploadedBy: fileData.uploadedBy,
      },
    });
    if (data?.result === "success") {
      return {
        success: true,
        fileId: data.fileId,
        fileName: data.fileName,
        fileUrl: data.fileUrl,
        version: data.version,
      };
    }
    return { success: false, error: data?.message || "Upload failed" };
  } catch (error) {
    return {
      success: false,
      error: error.userMessage || "Something went wrong",
    };
  }
};

// ─── List Program Document Files ──────────────────────────────────
export const listProgramDocumentFiles = async (userProgramDocumentId) => {
  const result = await apiPost(
    GOVERNMENT_ENDPOINT,
    GOVERNMENT_OPS.LIST_PROGRAM_DOCUMENT_FILES,
    { userProgramDocumentId },
  );
  if (result.success && result.data?.fileList?.length > 0)
    return result.data.fileList;
  return [];
};

// ─── Delete Program Document File ─────────────────────────────────
export const deleteProgramDocumentFile = async (fileId) => {
  const result = await apiPost(
    GOVERNMENT_ENDPOINT,
    GOVERNMENT_OPS.DELETE_PROGRAM_DOCUMENT_FILE,
    { fileId },
  );
  return result.success && result.data?.result?.toLowerCase() === "success";
};

// ═══════════════════════════════════════════════════════════════════
// ─── myGovernment — NOTIFICATIONS ─────────────────────────────────
// ═══════════════════════════════════════════════════════════════════

// ─── Get Notifications ────────────────────────────────────────────
export const getNotifications = async (
  profileId,
  groupId,
  isRead = "false",
) => {
  const result = await apiPost(
    GOVERNMENT_ENDPOINT,
    GOVERNMENT_OPS.GET_NOTIFICATIONS,
    {
      profileId,
      groupId,
      isRead,
    },
  );
  if (result.success && result.data?.notificationList?.length > 0)
    return result.data.notificationList;
  return [];
};

// ─── Mark Notification Read ───────────────────────────────────────
export const markNotificationRead = async (notificationId) => {
  const result = await apiPost(
    GOVERNMENT_ENDPOINT,
    GOVERNMENT_OPS.MARK_NOTIFICATION_READ,
    { notificationId },
  );
  return result.success && result.data?.result?.toLowerCase() === "success";
};

// ═══════════════════════════════════════════════════════════════════
// ─── myGovernment — CALENDAR & DASHBOARD ──────────────────────────
// ═══════════════════════════════════════════════════════════════════

// ─── Get Calendar Tasks ───────────────────────────────────────────
export const getCalendarTasks = async (
  profileId,
  groupId,
  unitCode,
  programType = "",
  fromDate = "",
  toDate = "",
) => {
  const result = await apiPost(
    GOVERNMENT_ENDPOINT,
    GOVERNMENT_OPS.GET_CALENDAR_TASKS,
    {
      programType,
      profileId,
      fromDate,
      toDate,
      groupId,
      unitCode,
    },
  );
  if (result.success && result.data?.taskList?.length > 0)
    return result.data.taskList;
  return [];
};

// ─── Get Dashboard Summary ────────────────────────────────────────
export const getDashboardSummary = async (profileId, groupId, unitCode) => {
  const result = await apiPost(
    GOVERNMENT_ENDPOINT,
    GOVERNMENT_OPS.GET_DASHBOARD_SUMMARY,
    { profileId, groupId, unitCode },
  );
  if (result.success && result.data?.summary) return result.data.summary;
  return null;
};
