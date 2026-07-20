import checkInApi from '@/helpers/checkInApi';
import { fmtDate } from '@/utils/checkInFormat';
import { useEffect, useState } from 'react';
import { PENDING_SETTLEMENTS_STAT_META, STATUS_OVERVIEW_META, STAT_CARD_META } from '../models/analyticsDashboardModel';

const SUMMARY_ENDPOINT = '/checkin-checkout/dashboard/summary/';
const PENDING_SETTLEMENTS_ENDPOINT = '/checkin-checkout/dashboard/pending_settlements/';
const CHECK_INS_ENDPOINT = '/checkin-checkout/check_in/get_all/';
const CHECK_OUTS_ENDPOINT = '/checkin-checkout/check_out/get_all/';

// GET /checkin-checkout/dashboard/summary/ response shape:
// { data: { totalCheckIns, pendingCheckIns, totalCheckOuts, pendingCheckOuts, pendingSettlements,
//   statusOverview: { checkedIn:{count,percentage}, checkedOut:{...}, pendingCheckIn:{...}, pendingCheckOut:{...} },
//   monthlyOverview: [{month, year, checkedIn, checkedOut}] } }
const mapStats = (summary = {}, pendingSettlementsTotal) => [
  ...STAT_CARD_META.map((meta) => ({
    title: meta.title,
    amount: String(summary[meta.key] ?? 0),
    icon: meta.icon,
    variant: meta.variant,
  })),
  {
    title: PENDING_SETTLEMENTS_STAT_META.title,
    amount: `OMR ${pendingSettlementsTotal.toLocaleString('en-US', { maximumFractionDigits: 2 })}`,
    icon: PENDING_SETTLEMENTS_STAT_META.icon,
    variant: PENDING_SETTLEMENTS_STAT_META.variant,
  },
];

const mapStatusOverview = (summary = {}) =>
  STATUS_OVERVIEW_META.map((meta) => {
    const entry = summary.statusOverview?.[meta.key] ?? {};
    return {
      label: meta.label,
      value: entry.count ?? 0,
      color: meta.color,
      display: `${(entry.percentage ?? 0).toFixed(2)}%`,
    };
  });

const mapMonthlyOverview = (summary = {}) => {
  const rows = Array.isArray(summary.monthlyOverview) ? summary.monthlyOverview : [];
  return {
    categories: rows.map((row) => row.month),
    series: [
      { name: 'Checked-In', data: rows.map((row) => row.checkedIn ?? 0) },
      { name: 'Checked-Out', data: rows.map((row) => row.checkedOut ?? 0) },
    ],
  };
};

// GET /checkin-checkout/dashboard/pending_settlements/ response shape:
// { data: { data: PendingSettlementItem[], presentPage, totalPage } }
// NOTE: item field names are unverified — the endpoint returns an empty list on the
// only account tested. Mapped defensively across plausible field names. See BACKEND_NOTES.md.
const mapPendingSettlement = (item) => ({
  name: item.tenantName || item.tenant || item.name || '—',
  property: [item.buildingName, item.flatUnitNumber].filter(Boolean).join(' - ') || item.property || item.propertyName || '—',
  amount: Number(item.amount ?? item.pendingAmount ?? item.settlementAmount ?? 0),
});

// GET /checkin-checkout/check_in/get_all/ response shape:
// { data: { data: CheckInListItem[], presentPage, totalPage } }
const mapRecentCheckIn = (item) => ({
  id: item.checkInId,
  tenantName: item.tenantName || '—',
  property: [item.buildingName, item.flatUnitNumber].filter(Boolean).join(' - ') || '—',
  date: fmtDate(item.checkInDate),
  status: item.checkInStatus || '—',
  assignedTo: item.assignedEmployee?.name || '—',
});

const daysLeftFromDate = (dateStr) => {
  if (!dateStr) return '—';
  const target = new Date(dateStr);
  if (Number.isNaN(target.getTime())) return '—';
  const diffDays = Math.round((target.setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays < 0) return 'Overdue';
  return `${diffDays} Day${diffDays === 1 ? '' : 's'}`;
};

// GET /checkin-checkout/check_out/get_all/ response shape:
// { data: { data: CheckOutListItem[], presentPage, totalPage } }
const mapRecentCheckOut = (item) => ({
  id: item.checkOutCode || item.checkOutId,
  tenantName: item.tenantName || '—',
  property: [item.buildingName, item.flatUnitNumber].filter(Boolean).join(' - ') || '—',
  date: fmtDate(item.checkOutDate),
  status: item.checkOutStatus || '—',
  daysLeft: daysLeftFromDate(item.checkOutDate),
});

export const useAnalyticsDashboardController = () => {
  const [stats, setStats] = useState([]);
  const [statusOverview, setStatusOverview] = useState([]);
  const [monthlyOverview, setMonthlyOverview] = useState({ categories: [], series: [] });
  const [pendingSettlements, setPendingSettlements] = useState([]);
  const [recentCheckIns, setRecentCheckIns] = useState([]);
  const [recentCheckOuts, setRecentCheckOuts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const loadDashboard = async () => {
      try {
        const [summaryRes, settlementsRes, checkInsRes, checkOutsRes] = await Promise.all([
          checkInApi.get(SUMMARY_ENDPOINT),
          checkInApi.get(PENDING_SETTLEMENTS_ENDPOINT, { params: { page_num: 1, limit: 10 } }),
          checkInApi.get(CHECK_INS_ENDPOINT, { params: { page_num: 1, limit: 10 } }),
          checkInApi.get(CHECK_OUTS_ENDPOINT, { params: { page_num: 1, limit: 10 } }),
        ]);

        if (cancelled) return;

        const settlementItems = settlementsRes.data?.data?.data ?? [];
        const mappedSettlements = settlementItems.map(mapPendingSettlement);
        const settlementsTotal = mappedSettlements.reduce((sum, item) => sum + item.amount, 0);
        setPendingSettlements(mappedSettlements);

        const summary = summaryRes.data?.data ?? {};
        setStats(mapStats(summary, settlementsTotal));
        setStatusOverview(mapStatusOverview(summary));
        setMonthlyOverview(mapMonthlyOverview(summary));

        const checkInItems = checkInsRes.data?.data?.data ?? [];
        setRecentCheckIns(checkInItems.map(mapRecentCheckIn));

        const checkOutItems = checkOutsRes.data?.data?.data ?? [];
        setRecentCheckOuts(checkOutItems.map(mapRecentCheckOut));
      } catch (err) {
        const status = err?.response?.status;
        const detail = err?.response?.data?.detail || err?.response?.data?.message || err?.message || 'Unknown error';
        const msg = status ? `HTTP ${status}: ${detail}` : detail;
        console.error('Main dashboard fetch failed:', msg);
        if (!cancelled) setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadDashboard();
    return () => {
      cancelled = true;
    };
  }, []);

  return {
    stats,
    statusOverview,
    monthlyOverview,
    pendingSettlements,
    recentCheckIns,
    recentCheckOuts,
    loading,
    error,
  };
};
