import axios from "axios";
import { getErrorMessage } from "../../utils/errorHandler";

// ─── Axios Instance ───────────────────────────────────────────────────────────
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 60000,
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem("k2k-auth-store");
    if (stored) {
      const parsed = JSON.parse(stored);
      const token = parsed?.state?.token;
      const profileId = parsed?.state?.profile?.profileId;
      if (token) config.headers.Authorization = `Bearer ${token}`;
      // Naya k2uApi ownership check ke liye X-Profile-Id header padhta hai.
      if (profileId) config.headers["X-Profile-Id"] = profileId;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = getErrorMessage(error);
    if (error.response?.status === 401) {
      localStorage.removeItem("k2k-auth-store");
      window.location.href = "/login";
    }
    return Promise.reject({ ...error, userMessage: message });
  },
);

// ─── Generic POST helper ──────────────────────────────────────────────────────
export const apiPost = async (endpoint, operation, data = {}) => {
  try {
    const { data: responseData } = await apiClient.post(endpoint, {
      operation,
      ...data,
    });
    return { success: true, data: responseData };
  } catch (error) {
    return {
      success: false,
      error: error.userMessage || "Something went wrong",
    };
  }
};

export default apiClient;
