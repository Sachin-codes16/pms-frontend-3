import api from "@/helpers/api";
import { useEffect, useState } from "react";

const LIST_ENDPOINT = "/property/get_all/";
const PAGE_SIZE = 9;

// strips the space in UI labels like "2 BHK" -> API expects "2BHK";
// "4 & 5 BHK" expands to two real enum tokens.
const toBedroomParams = (label) => {
  if (label === "4 & 5 BHK") return ["4BHK", "5BHK"];
  return [label.replace(/\s+/g, "")];
};

export const usePropertyGridController = () => {
  const [city, setCity] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedBedrooms, setSelectedBedrooms] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [selectedRentalFor, setSelectedRentalFor] = useState([]);
  const [minRentInput, setMinRentInput] = useState("");
  const [maxRentInput, setMaxRentInput] = useState("");
  const [minRent, setMinRent] = useState("");
  const [maxRent, setMaxRent] = useState("");

  const [properties, setProperties] = useState([]);
  const [presentPage, setPresentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // debounce price range inputs
  useEffect(() => {
    const handle = setTimeout(() => {
      setPresentPage(1);
      setMinRent(minRentInput.trim());
      setMaxRent(maxRentInput.trim());
    }, 400);
    return () => clearTimeout(handle);
  }, [minRentInput, maxRentInput]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    const params = { page_num: presentPage, limit: PAGE_SIZE };
    if (city) params.city = city;
    if (selectedTypes.length) params.property_types = selectedTypes.join(",");
    if (selectedBedrooms.length) params.bedrooms = selectedBedrooms.flatMap(toBedroomParams).join(",");
    if (selectedFeatures.length) params.features = selectedFeatures.join(",");
    if (selectedRentalFor.length) params.rental_for = selectedRentalFor.join(",");
    if (minRent) params.min_rent = minRent;
    if (maxRent) params.max_rent = maxRent;

    api
      .get(LIST_ENDPOINT, { params })
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
  }, [presentPage, city, selectedTypes, selectedBedrooms, selectedFeatures, selectedRentalFor, minRent, maxRent]);

  const goToPage = (page) => {
    const clamped = Math.min(Math.max(page, 1), totalPage);
    setPresentPage(clamped);
  };

  const toggleType = (type) => {
    setPresentPage(1);
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
  };

  const toggleBedroom = (bedroom) => {
    setPresentPage(1);
    setSelectedBedrooms((prev) => (prev.includes(bedroom) ? prev.filter((b) => b !== bedroom) : [...prev, bedroom]));
  };

  const toggleFeature = (feature) => {
    setPresentPage(1);
    setSelectedFeatures((prev) => (prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]));
  };

  const toggleRentalFor = (rentalFor) => {
    setPresentPage(1);
    setSelectedRentalFor((prev) => (prev.includes(rentalFor) ? prev.filter((r) => r !== rentalFor) : [...prev, rentalFor]));
  };

  const setCityFilter = (value) => {
    setPresentPage(1);
    setCity(value);
  };

  return {
    properties,
    loading,
    error,
    presentPage,
    totalPage,
    goToPage,
    city,
    setCity: setCityFilter,
    selectedTypes,
    toggleType,
    selectedBedrooms,
    toggleBedroom,
    selectedFeatures,
    toggleFeature,
    selectedRentalFor,
    toggleRentalFor,
    minRentInput,
    setMinRentInput,
    maxRentInput,
    setMaxRentInput,
  };
};
