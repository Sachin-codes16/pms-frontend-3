import checkInApi from '@/helpers/checkInApi';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { rentalReportContent, rentalReportFilters } from '../models/rentalReportModel';

const SUMMARY_ENDPOINT = '/property/rental-report/summary/';
const LIST_ENDPOINT = '/property/rental-report/get_all/';
const PAGE_SIZE = 8;
const EXPORT_PAGE_SIZE = 500;

const mapRow = (item) => ({
  id: item.propertyId,
  title: item.title || '-',
  type: item.type || '-',
  target: item.target || '-',
  addedBy: item.addedBy || '-',
  area: item.areaSqft ?? '-',
  rooms: item.rooms ?? '-',
  features: Array.isArray(item.features) && item.features.length ? item.features.join(', ') : '-',
  rent: item.rent != null ? `${item.rent} OMR` : '-',
  status: item.status || '-',
});

// strips the space in UI labels like "2 BHK" -> API expects "2BHK"
const toBedroomParam = (label) => label.replace(/\s+/g, '');

// backend expects DD-MM-YY; fromDate/toDate are Date objects from the date picker
const toApiDateParam = (date) => {
  if (!date) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}-${month}-${year}`;
};

export const useRentalReportController = () => {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedBedrooms, setSelectedBedrooms] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [selectedRentalFor, setSelectedRentalFor] = useState([]);
  const [minRentInput, setMinRentInput] = useState('');
  const [maxRentInput, setMaxRentInput] = useState('');
  const [minRent, setMinRent] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  // debounce free-text search
  useEffect(() => {
    const handle = setTimeout(() => {
      setPresentPage(1);
      setSearch(searchInput.trim());
    }, 400);
    return () => clearTimeout(handle);
  }, [searchInput]);

  // debounce price range inputs
  useEffect(() => {
    const handle = setTimeout(() => {
      setPresentPage(1);
      setMinRent(minRentInput.trim());
      setMaxRent(maxRentInput.trim());
    }, 400);
    return () => clearTimeout(handle);
  }, [minRentInput, maxRentInput]);

  const buildFilterParams = () => {
    const params = {};
    if (search) params.search = search;
    if (city) params.city = city;
    if (selectedTypes.length) params.property_types = selectedTypes.join(',');
    if (selectedBedrooms.length) params.bedrooms = selectedBedrooms.map(toBedroomParam).join(',');
    if (selectedFeatures.length) params.features = selectedFeatures.join(',');
    if (selectedRentalFor.length) params.rental_for = selectedRentalFor.join(',');
    if (minRent) params.min_rent = minRent;
    if (maxRent) params.max_rent = maxRent;
    if (fromDate) params.from_date = toApiDateParam(fromDate);
    if (toDate) params.to_date = toApiDateParam(toDate);
    return params;
  };

  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setSummaryLoading(true);
    setSummaryError('');

    checkInApi
      // cache-bust so freshly created/updated properties are reflected immediately
      .get(SUMMARY_ENDPOINT, { params: { ...buildFilterParams(), _: Date.now() }, headers: { 'Cache-Control': 'no-cache' } })
      .then((res) => {
        if (cancelled) return;
        setSummary(res.data?.data ?? null);
      })
      .catch((err) => {
        if (cancelled) return;
        const status = err?.response?.status;
        const detail = err?.response?.data?.detail || err?.response?.data?.message || err?.message || 'Unable to load rental report summary.';
        setSummaryError(status ? `HTTP ${status}: ${detail}` : detail);
      })
      .finally(() => {
        if (!cancelled) setSummaryLoading(false);
      });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, city, selectedTypes, selectedBedrooms, selectedFeatures, selectedRentalFor, minRent, maxRent, fromDate, toDate]);

  const totalProperties = summary?.totalProperties ?? 0;

  const [presentPage, setPresentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [rowsLoading, setRowsLoading] = useState(true);
  const [rowsError, setRowsError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setRowsLoading(true);
    setRowsError('');

    const params = { page_num: presentPage, limit: PAGE_SIZE, ...buildFilterParams(), _: Date.now() };

    checkInApi
      .get(LIST_ENDPOINT, { params, headers: { 'Cache-Control': 'no-cache' } })
      .then((res) => {
        if (cancelled) return;
        const data = res.data?.data ?? {};
        const list = data.data ?? [];
        setRows(list.map(mapRow));
        setTotalPage(data.totalPage ?? 1);
      })
      .catch((err) => {
        if (cancelled) return;
        const status = err?.response?.status;
        const detail = err?.response?.data?.detail || err?.response?.data?.message || err?.message || 'Unable to load rental report.';
        setRowsError(status ? `HTTP ${status}: ${detail}` : detail);
      })
      .finally(() => {
        if (!cancelled) setRowsLoading(false);
      });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presentPage, search, city, selectedTypes, selectedBedrooms, selectedFeatures, selectedRentalFor, minRent, maxRent, fromDate, toDate]);

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

  const [exportLoading, setExportLoading] = useState(false);
  const [exportError, setExportError] = useState('');

  const exportExcel = async () => {
    setExportLoading(true);
    setExportError('');

    const params = { limit: EXPORT_PAGE_SIZE, ...buildFilterParams() };

    try {
      let page = 1;
      let totalPages = 1;
      const allItems = [];

      do {
        const res = await checkInApi.get(LIST_ENDPOINT, { params: { ...params, page_num: page } });
        const data = res.data?.data ?? {};
        allItems.push(...(data.data ?? []));
        totalPages = data.totalPage ?? 1;
        page += 1;
      } while (page <= totalPages);

      const excelRows = allItems.map((item, index) => ({
        'Sr. No.': index + 1,
        'P. ID': item.propertyId,
        Title: item.title || '-',
        Type: item.type || '-',
        Target: item.target || '-',
        'Added By': item.addedBy || '-',
        'Area (sq.ft)': item.areaSqft ?? '-',
        Rooms: item.rooms ?? '-',
        Features: Array.isArray(item.features) && item.features.length ? item.features.join(', ') : '-',
        'Rent (OMR)': item.rent ?? '-',
        Status: item.status || '-',
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelRows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Rental Report');
      XLSX.writeFile(workbook, `Rental_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (err) {
      const status = err?.response?.status;
      const detail = err?.response?.data?.detail || err?.response?.data?.message || err?.message || 'Unable to export rental report.';
      setExportError(status ? `HTTP ${status}: ${detail}` : detail);
    } finally {
      setExportLoading(false);
    }
  };

  return {
    ...rentalReportContent,
    totalProperties: `${totalProperties} Properties`,
    filterSummary: `Show ${totalProperties} Property`,
    summaryLoading,
    summaryError,
    filters: rentalReportFilters,
    searchInput,
    setSearchInput,
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
    fromDate,
    setFromDate: (v) => { setPresentPage(1); setFromDate(v); },
    toDate,
    setToDate: (v) => { setPresentPage(1); setToDate(v); },
    rows,
    rowsLoading,
    rowsError,
    presentPage,
    totalPage,
    goToPage,
    exportExcel,
    exportLoading,
    exportError,
  };
};
