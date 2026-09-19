import { useState, useCallback } from "react";
import { apiPost } from "../services/api";

// ─── Generic API Hook ─────────────────────────────────────────────────────────
const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  // ─── Call API ────────────────────────────────────────────────────────────────
  const callApi = useCallback(async (endpoint, operation, userData = {}) => {
    try {
      setLoading(true);
      setError(null);

      const result = await apiPost(endpoint, operation, userData);

      if (result.success) {
        setData(result.data);
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const msg = err?.message || "Kuch error aaya.";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Reset State ─────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    loading,
    error,
    data,
    callApi,
    reset,
  };
};

// ─── Paginated API Hook ───────────────────────────────────────────────────────
export const usePaginatedApi = (pageSize = 10) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPage = useCallback(
    async (endpoint, operation, userData = {}) => {
      try {
        setLoading(true);
        setError(null);

        const result = await apiPost(endapoint, operation, {
          ...userData,
          page,
          pageSize,
        });

        if (result.success) {
          const newItems = result.data?.items || result.data || [];
          setItems((prev) => (page === 1 ? newItems : [...prev, ...newItems]));
          setHasMore(newItems.length === pageSize);
          setPage((prev) => prev + 1);
          return { success: true };
        } else {
          setError(result.error);
          return { success: false };
        }
      } catch (err) {
        setError(err?.message || "Kuch error aaya.");
        return { success: false };
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize],
  );

  const reset = useCallback(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, []);

  return {
    loading,
    error,
    items,
    page,
    hasMore,
    fetchPage,
    reset,
  };
};

export default useApi;
