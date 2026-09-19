import axios from "axios";
import {
  API_FAILURE_KIND,
  assertSuccessfulEnvelope,
  toApiFailure,
} from "../../../core/http/ApiFailure";

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
      let parsed;
      try {
        parsed = JSON.parse(stored);
      } catch {
        localStorage.removeItem("k2k-auth-store");
        return config;
      }
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
    const failure = toApiFailure(error);
    if (failure.kind === API_FAILURE_KIND.unauthorized) {
      localStorage.removeItem("k2k-auth-store");
      window.location.href = "/login";
    }
    return Promise.reject(failure);
  },
);

// ─── Generic POST helper ──────────────────────────────────────────────────────
export const apiPost = async (endpoint, operation, data = {}) => {
  try {
    const { data: responseData } = await apiClient.post(endpoint, {
      operation,
      ...data,
    });
    return {
      success: true,
      data: assertSuccessfulEnvelope(responseData, operation),
    };
  } catch (error) {
    const failure = toApiFailure(error);
    return {
      success: false,
      error: failure.message,
      failure,
    };
  }
};

export default apiClient;
