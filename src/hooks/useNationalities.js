import checkInApi from "@/helpers/checkInApi";
import { useEffect, useState } from "react";

// GET /helper/nationality/get_all response shape:
// { data: { data: [{ nationalityId, name }], presentPage, totalPage } }
const NATIONALITIES_ENDPOINT = "/helper/nationality/get_all";

const useNationalities = () => {
  const [nationalities, setNationalities] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    checkInApi
      .get(NATIONALITIES_ENDPOINT, { params: { limit: 999999 } })
      .then((res) => {
        if (cancelled) return;
        const rows = res.data?.data?.data ?? [];
        setNationalities(rows.map((row) => row.name).filter(Boolean));
      })
      .catch((err) => {
        console.error("Failed to load nationalities:", err?.message || err);
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { nationalities, loaded };
};

export default useNationalities;
