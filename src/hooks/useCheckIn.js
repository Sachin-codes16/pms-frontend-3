import { useCallback, useEffect, useState } from "react";
import api from "@/helpers/api";

const DEFAULT_ENDPOINT = "/check-ins";

export default function useCheckIn({ endpoint = DEFAULT_ENDPOINT, id } = {}) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState(null);

  const fetchItem = useCallback(
    async (params = {}) => {
      if (!id) return null;
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`${endpoint}/${id}`, { params });
        setItem(res.data);
        setLoading(false);
        return res.data;
      } catch (err) {
        setError(err);
        try {
          console.error(
            "useCheckIn.fetchItem error:",
            err?.response?.status,
            err?.response?.data || err?.message,
          );
        } catch (e) {
          console.error("useCheckIn.fetchItem unexpected error", err);
        }
        setLoading(false);
        return null;
      }
    },
    [endpoint, id],
  );

  const save = useCallback(
    async (payload) => {
      setLoading(true);
      setError(null);
      try {
        let res;
        if (id) {
          res = await api.put(`${endpoint}/${id}`, payload);
        } else {
          res = await api.post(endpoint, payload);
        }
        setItem(res.data);
        setLoading(false);
        return res.data;
      } catch (err) {
        setError(err);
        try {
          console.error(
            "useCheckIn.save error:",
            err?.response?.status,
            err?.response?.data || err?.message,
          );
        } catch (e) {
          console.error("useCheckIn.save unexpected error", err);
        }
        setLoading(false);
        throw err;
      }
    },
    [endpoint, id],
  );

  useEffect(() => {
    if (id) fetchItem();
  }, [id, fetchItem]);

  return { item, loading, error, fetchItem, save };
}
