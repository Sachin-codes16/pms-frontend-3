import checkInApi from '@/helpers/checkInApi';
import { useEffect, useState } from 'react';
import { occupancyReportFilters } from '../models/occupancyReportModel';

const SUMMARY_ENDPOINT = '/property/occupancy/summary/';
const LIST_ENDPOINT = '/property/occupancy/get_all/';
const PAGE_SIZE = 8;

const formatDate = (value) => {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

// backend expects DD-MM-YY; the <input type="date"> gives YYYY-MM-DD
const toApiDateParam = (isoValue) => {
  if (!isoValue) return '';
  const [year, month, day] = isoValue.split('-');
  if (!year || !month || !day) return '';
  return `${day}-${month}-${year.slice(-2)}`;
};

const mapRow = (item, index, presentPage) => ({
  srNo: String((presentPage - 1) * PAGE_SIZE + index + 1).padStart(2, '0'),
  id: item.propertyId,
  propertyName: item.propertyName || '-',
  type: item.type || '-',
  building: item.buildingProject || '-',
  unitNo: item.unitNo || '-',
  startDate: formatDate(item.startDate),
  endDate: formatDate(item.endDate),
  rent: item.rent != null ? `${item.rent} OMR` : '-',
  status: item.status || '-',
});

export const useOccupancyReportController = () => {
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setSummaryLoading(true);
    setSummaryError('');

    checkInApi
      .get(SUMMARY_ENDPOINT)
      .then((res) => {
        if (cancelled) return;
        setSummary(res.data?.data ?? null);
      })
      .catch((err) => {
        if (cancelled) return;
        const status = err?.response?.status;
        const detail = err?.response?.data?.detail || err?.response?.data?.message || err?.message || 'Unable to load occupancy summary.';
        setSummaryError(status ? `HTTP ${status}: ${detail}` : detail);
      })
      .finally(() => {
        if (!cancelled) setSummaryLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const stats = [
    { label: 'Total Properties', value: String(summary?.totalProperties ?? 0), icon: 'solar:calendar-date-bold-duotone', color: '#604ae3', bg: '#f0edff' },
    {
      label: 'Rented',
      value: String(summary?.rented ?? 0),
      icon: 'solar:chart-square-bold-duotone',
      color: '#58bd7d',
      bg: '#eaf8f0',
      change: summary?.rentedChangePercentage ? `${summary.rentedChangePercentage}%` : undefined,
    },
    { label: 'Vacant', value: String(summary?.vacant ?? 0), icon: 'solar:user-plus-rounded-bold-duotone', color: '#ff8b3d', bg: '#fff3ec' },
    { label: 'Booked', value: String(summary?.booked ?? 0), icon: 'solar:chart-2-bold-duotone', color: '#38c6cf', bg: '#eafafa' },
  ];

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [presentPage, setPresentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [rowsLoading, setRowsLoading] = useState(true);
  const [rowsError, setRowsError] = useState('');

  // debounce free-text search
  useEffect(() => {
    const handle = setTimeout(() => {
      setPresentPage(1);
      setSearch(searchInput.trim());
    }, 400);
    return () => clearTimeout(handle);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;
    setRowsLoading(true);
    setRowsError('');

    const params = { page_num: presentPage, limit: PAGE_SIZE };
    if (search) params.search = search;
    if (selectedTypes.length) params.property_types = selectedTypes.join(',');
    if (selectedStatuses.length) params.statuses = selectedStatuses.join(',');
    if (fromDate) params.from_date = toApiDateParam(fromDate);
    if (toDate) params.to_date = toApiDateParam(toDate);

    checkInApi
      .get(LIST_ENDPOINT, { params })
      .then((res) => {
        if (cancelled) return;
        const data = res.data?.data ?? {};
        const list = data.data ?? [];
        setRows(list.map((item, index) => mapRow(item, index, data.presentPage ?? presentPage)));
        setTotalPage(data.totalPage ?? 1);
      })
      .catch((err) => {
        if (cancelled) return;
        const status = err?.response?.status;
        const detail = err?.response?.data?.detail || err?.response?.data?.message || err?.message || 'Unable to load occupancy report.';
        setRowsError(status ? `HTTP ${status}: ${detail}` : detail);
      })
      .finally(() => {
        if (!cancelled) setRowsLoading(false);
      });

    return () => { cancelled = true; };
  }, [presentPage, search, selectedTypes, selectedStatuses, fromDate, toDate]);

  const toggleType = (type) => {
    setPresentPage(1);
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
  };

  const toggleStatus = (status) => {
    setPresentPage(1);
    setSelectedStatuses((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]));
  };

  const goToPage = (page) => {
    const clamped = Math.min(Math.max(page, 1), totalPage);
    setPresentPage(clamped);
  };

  return {
    filters: occupancyReportFilters,
    selectedTypes,
    selectedStatuses,
    toggleType,
    toggleStatus,
    searchInput,
    setSearchInput,
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
    stats,
    summaryLoading,
    summaryError,
  };
};
