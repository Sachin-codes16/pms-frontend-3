import { useCallback, useEffect, useState } from "react";
import api from "@/helpers/checkInApi";

const GET_ENDPOINT    = "/checkin-checkout/check_out/get/";
const CREATE_ENDPOINT = "/checkin-checkout/check_out/create/";
const UPDATE_ENDPOINT = "/checkin-checkout/check_out/update";

export default function useCheckOut({ id } = {}) {
  const [item, setItem]       = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError]     = useState(null);

  const fetchItem = useCallback(async () => {
    if (!id) return null;
    setLoading(true);
    setError(null);
    try {
      const res  = await api.get(GET_ENDPOINT, { params: { check_out_id: id } });
      const data = res.data?.data ?? null;
      setItem(data);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err);
      console.error("useCheckOut.fetchItem error:", err?.response?.status, err?.response?.data || err?.message);
      setLoading(false);
      return null;
    }
  }, [id]);

  // Note: does not touch `loading` — that reflects the initial record fetch,
  // not a mutation in flight. Callers key their form's remount on `loading`,
  // so toggling it here would wipe unsaved input on every submit.
  const create = useCallback(async (payload) => {
    setError(null);
    try {
      const res = await api.post(CREATE_ENDPOINT, payload);
      return res.data;
    } catch (err) {
      setError(err);
      console.error("useCheckOut.create error:", err?.response?.status, err?.response?.data || err?.message);
      throw err;
    }
  }, []);

  const updateSections = useCallback(async (checkOutId, sections) => {
    const entries = Object.entries(sections).filter(([, body]) => body && Object.keys(body).length > 0);
    setError(null);
    try {
      const results = await Promise.all(
        entries.map(([sectionKey, body]) =>
          api.patch(`${UPDATE_ENDPOINT}/${sectionKey}/`, { check_out_id: checkOutId, ...body })
        )
      );
      return results.map((res) => res.data);
    } catch (err) {
      setError(err);
      console.error("useCheckOut.updateSections error:", err?.response?.status, err?.response?.data || err?.message);
      throw err;
    }
  }, []);

  useEffect(() => {
    if (id) fetchItem();
  }, [id, fetchItem]);

  return { item, loading, error, fetchItem, create, updateSections };
}
