import { useCallback, useEffect, useState } from "react";
import api from "@/helpers/api";

const DEFAULT_ENDPOINT = "/check-ins";

export default function useCheckIns({
  endpoint = DEFAULT_ENDPOINT,
  page = 1,
  pageSize = 20,
} = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (params = {}) => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(endpoint, {
          params: { page, pageSize, ...params },
        });
        setData(res.data);
        setLoading(false);
        return res.data;
      } catch (err) {
        setError(err);
        // log details to console for debugging (network response, message)
        try {
          console.error(
            "useCheckIns error:",
            err?.response?.status,
            err?.response?.data || err?.message,
          );
        } catch (e) {
          console.error("useCheckIns unexpected error", err);
        }
        setLoading(false);
        return null;
      }
    },
    [endpoint, page, pageSize],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, reload: fetchData };
}
