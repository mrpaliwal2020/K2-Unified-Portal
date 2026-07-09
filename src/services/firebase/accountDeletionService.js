// ─── Account Deletion Requests (local store) ──────────────────────────────────
// OTP verify (Firebase Auth) ke BAAD is feature ka Firebase se koi sambandh nahi.
// Koi actual account/data delete NAHI hota — sirf "kaun-kaun request kar raha hai"
// iski entry browser ke localStorage me store hoti hai. Na backend, na Firestore,
// na koi rule/permission.

const STORAGE_KEY = "k2k-account-deletion-requests";
const SEQ_KEY = "k2k-account-deletion-seq";

// Sirf is number se login karne per hi admin dashboard dikhega.
export const ADMIN_MOBILE = "9302929617";

// Kisi bhi format ke number ko last 10 digit me normalize karta hai.
export const normalizeMobile = (num) =>
  String(num || "")
    .replace(/\D/g, "")
    .slice(-10);

export const isAdminMobile = (num) => normalizeMobile(num) === ADMIN_MOBILE;

// ─── Local storage helpers ────────────────────────────────────────────────────
const readAll = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

const writeAll = (list) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};

// Auto-increment sequence id (1, 2, 3 ...) — delete hone par bhi repeat na ho.
const nextSeq = () => {
  const current = parseInt(localStorage.getItem(SEQ_KEY) || "0", 10);
  const next = current + 1;
  localStorage.setItem(SEQ_KEY, String(next));
  return next;
};

// ─── Create Delete Request ────────────────────────────────────────────────────
// OTP verify hone ke baad bas ek entry log hoti hai.
export const createDeletionRequest = async ({ mobileNumber }) => {
  try {
    const now = new Date().toISOString();
    const list = readAll();
    list.push({
      id: nextSeq(),
      mobileNumber: normalizeMobile(mobileNumber),
      status: "New", // "New" → "Removed"
      requestedSubmittedAt: now,
      updatedAt: now,
    });
    writeAll(list);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Request save nahi hui." };
  }
};

// ─── Get All Requests (admin dashboard) ───────────────────────────────────────
export const getDeletionRequests = async () => {
  const requests = readAll().sort(
    (a, b) =>
      new Date(b.requestedSubmittedAt).getTime() -
      new Date(a.requestedSubmittedAt).getTime(),
  );
  return { success: true, requests };
};

// ─── Set Action (Done / Rejected) ─────────────────────────────────────────────
// Sirf record ki state update hoti hai — koi actual account delete NAHI hota.
// "Done" → status "Removed", "Rejected" → status "New" (wapas). UpdatedAt refresh.
export const setRequestAction = async (id, action) => {
  const list = readAll();
  const idx = list.findIndex((r) => r.id === id);
  if (idx === -1) return { success: false, error: "Request nahi mili." };

  const status = action === "Done" ? "Removed" : "New";
  list[idx] = {
    ...list[idx],
    status,
    action,
    updatedAt: new Date().toISOString(),
  };
  writeAll(list);
  return { success: true, status, action };
};
