import api from "@/helpers/api";
import { useEffect, useState } from "react";

const LIST_ENDPOINT = "/property/get_all/";
const PAGE_SIZE = 9;

export const usePropertyGridController = () => {
  const [properties, setProperties] = useState([]);
  const [presentPage, setPresentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    api
      .get(LIST_ENDPOINT, { params: { page_num: presentPage, limit: PAGE_SIZE } })
      .then((res) => {
        if (cancelled) return;
        const data = res.data?.data ?? {};
        setProperties(data.data ?? []);
        setTotalPage(data.totalPage ?? 1);
      })
      .catch((err) => {
        if (cancelled) return;
        const status = err?.response?.status;
        const detail = err?.response?.data?.detail || err?.response?.data?.message || err?.message || "Unable to load properties.";
        setError(status ? `HTTP ${status}: ${detail}` : detail);
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [presentPage]);

  const goToPage = (page) => {
    const clamped = Math.min(Math.max(page, 1), totalPage);
    setPresentPage(clamped);
  };

  return {
    properties,
    loading,
    error,
    presentPage,
    totalPage,
    goToPage,
  };
};
