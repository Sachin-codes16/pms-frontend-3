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

  const create = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post(CREATE_ENDPOINT, payload);
      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err);
      console.error("useCheckOut.create error:", err?.response?.status, err?.response?.data || err?.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const updateSections = useCallback(async (checkOutId, sections) => {
    const entries = Object.entries(sections).filter(([, body]) => body && Object.keys(body).length > 0);
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.all(
        entries.map(([sectionKey, body]) =>
          api.patch(`${UPDATE_ENDPOINT}/${sectionKey}/`, { check_out_id: checkOutId, ...body })
        )
      );
      setLoading(false);
      return results.map((res) => res.data);
    } catch (err) {
      setError(err);
      console.error("useCheckOut.updateSections error:", err?.response?.status, err?.response?.data || err?.message);
      setLoading(false);
      throw err;
    }
  }, []);

  useEffect(() => {
    if (id) fetchItem();
  }, [id, fetchItem]);

  return { item, loading, error, fetchItem, create, updateSections };
}
