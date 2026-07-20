import { useCallback, useEffect, useState } from "react";
import api from "@/helpers/checkInApi";

const GET_ENDPOINT = "/checkin-checkout/check_in/get/";
const CREATE_ENDPOINT = "/checkin-checkout/check_in/create/";
const UPDATE_ENDPOINT = "/checkin-checkout/check_in/update";

export default function useCheckIn({ id } = {}) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState(null);

  const fetchItem = useCallback(async () => {
    if (!id) return null;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(GET_ENDPOINT, {
        params: { check_in_id: id },
      });
      const data = res.data?.data ?? null;
      setItem(data);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err);
      console.error(
        "useCheckIn.fetchItem error:",
        err?.response?.status,
        err?.response?.data || err?.message,
      );
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
      console.error(
        "useCheckIn.create error:",
        err?.response?.status,
        err?.response?.data || err?.message,
      );
      setLoading(false);
      throw err;
    }
  }, []);

  // sections: { [sectionKey]: { ...fields } } — only non-empty sections are sent,
  // one PATCH per section since there's no single update-the-whole-record endpoint.
  const updateSections = useCallback(async (checkInId, sections) => {
    const entries = Object.entries(sections).filter(
      ([, body]) => body && Object.keys(body).length > 0,
    );
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.all(
        entries.map(([sectionKey, body]) =>
          api.patch(`${UPDATE_ENDPOINT}/${sectionKey}/`, {
            check_in_id: checkInId,
            ...body,
          }),
        ),
      );
      setLoading(false);
      return results.map((res) => res.data);
    } catch (err) {
      setError(err);
      console.error(
        "useCheckIn.updateSections error:",
        err?.response?.status,
        err?.response?.data || err?.message,
      );
      setLoading(false);
      throw err;
    }
  }, []);

  useEffect(() => {
    if (id) fetchItem();
  }, [id, fetchItem]);

  return { item, loading, error, fetchItem, create, updateSections };
}
