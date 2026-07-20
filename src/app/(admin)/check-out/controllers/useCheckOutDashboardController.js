import checkInApi from '@/helpers/checkInApi';
import { fmtDate, fmtMoney } from '@/utils/checkInFormat';
import { useEffect, useState } from 'react';
import {
  OVERVIEW_CARD_META,
  PROGRESS_STEP_META,
  STATUS_OVERVIEW_META,
  STAT_CARD_META,
} from '../models/checkOutDashboardModel';

const SUMMARY_ENDPOINT = '/checkin-checkout/check_out/dashboard/summary/';
const UPCOMING_ENDPOINT = '/checkin-checkout/check_out/dashboard/upcoming/';
const WIDGETS_ENDPOINT = '/checkin-checkout/check_out/dashboard/widgets/';
const CHECK_OUTS_ENDPOINT = '/checkin-checkout/check_out/get_all/';

// GET /checkin-checkout/check_out/dashboard/summary/ response shape:
// { data: { totalCheckOuts, pendingCheckOuts, completedCheckOuts, pendingSettlements, overdueCheckOuts,
//   statusOverview: { completed:{count,percentage}, inProgress:{...}, pending:{...}, overdue:{...} },
//   progress: { requestRaised, inspection, repairAndDamage, utilityReading, settlement, completed, overallProgressPercentage } } }
const mapStats = (summary = {}) =>
  STAT_CARD_META.map((meta) => ({
    title: meta.title,
    amount: String(summary[meta.key] ?? 0),
    icon: meta.icon,
    color: meta.color,
    bg: meta.bg,
  }));

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

const mapProgressSteps = (summary = {}) =>
  PROGRESS_STEP_META.map((meta) => ({
    label: meta.label,
    value: String(summary.progress?.[meta.key] ?? 0),
    icon: meta.icon,
    color: meta.color,
    bg: meta.bg,
  }));

const mapProgressSummary = (summary = {}) => {
  const percent = Math.round(summary.progress?.overallProgressPercentage ?? 0);
  return { percent, label: `${percent}% Completed` };
};

// GET /checkin-checkout/check_out/dashboard/widgets/ response shape:
// { data: { financialOverview:{totalPendingAmount, collectedThisMonth},
//   topDamageCategories: [{category, count}], utilityOverview:{...}, keyReturnStatus:{...} } }
const mapOverviewCards = (widgets = {}) =>
  OVERVIEW_CARD_META.map((meta) => {
    const section = widgets[meta.key] ?? {};

    if (meta.key === 'topDamageCategories') {
      const items = Array.isArray(widgets.topDamageCategories) ? widgets.topDamageCategories : [];
      return {
        title: meta.title,
        icon: meta.icon,
        iconColor: meta.iconColor,
        iconBg: meta.iconBg,
        footer: meta.footer,
        rows: items.map((item) => ({
          label: item.category || item.name || item.label || '—',
          value: String(item.count ?? item.value ?? 0),
        })),
      };
    }

    return {
      title: meta.title,
      icon: meta.icon,
      iconColor: meta.iconColor,
      iconBg: meta.iconBg,
      footer: meta.footer,
      rows: meta.rows.map((row) => ({
        label: row.label,
        value: row.money ? fmtMoney(section[row.key] ?? 0) : String(section[row.key] ?? 0),
        stacked: row.stacked,
      })),
    };
  });

// GET /checkin-checkout/check_out/get_all/ response shape:
// { data: { data: CheckOutListItem[], presentPage, totalPage } }
const daysLeftFromDate = (dateStr) => {
  if (!dateStr) return '—';
  const target = new Date(dateStr);
  if (Number.isNaN(target.getTime())) return '—';
  const diffDays = Math.round((target.setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays < 0) return 'Overdue';
  return `${diffDays} Day${diffDays === 1 ? '' : 's'}`;
};

const mapPendingRow = (item) => ({
  id: item.checkOutCode || item.checkOutId,
  tenant: item.tenantName || '—',
  property: [item.buildingName, item.flatUnitNumber].filter(Boolean).join(' - ') || '—',
  date: fmtDate(item.checkOutDate),
  status: item.checkOutStatus || '—',
  daysLeft: daysLeftFromDate(item.checkOutDate),
});

// GET /checkin-checkout/check_out/dashboard/upcoming/ response shape:
// { data: { data: [{checkOutId, checkOutDate, daysLeft, tenantId, tenantName, propertyId,
//   propertyName, assignedEmployeeId, assignedEmployeeName}], presentPage, totalPage } }
const mapUpcomingItem = (item) => {
  const rawDate = item.checkOutDate || null;
  const parsedDate = rawDate ? new Date(rawDate) : null;
  const validDate = parsedDate && !Number.isNaN(parsedDate.getTime());

  return {
    day: validDate ? String(parsedDate.getDate()).padStart(2, '0') : '--',
    month: validDate ? parsedDate.toLocaleString('en-US', { month: 'long' }) : '—',
    property: item.propertyName || '—',
    tenant: item.tenantName || '—',
    daysLeft:
      item.daysLeft === 0 ? 'Today' : item.daysLeft > 0 ? `${item.daysLeft} Day${item.daysLeft === 1 ? '' : 's'}` : daysLeftFromDate(rawDate),
    assignedTo: item.assignedEmployeeName || '—',
    avatar: item.assignedEmployeeAvatar || null,
  };
};

export const useCheckOutDashboardController = () => {
  const [stats, setStats] = useState([]);
  const [statusOverview, setStatusOverview] = useState([]);
  const [progressSteps, setProgressSteps] = useState([]);
  const [progressSummary, setProgressSummary] = useState({ percent: 0, label: '0% Completed' });
  const [overviewCards, setOverviewCards] = useState([]);
  const [pendingCheckOuts, setPendingCheckOuts] = useState([]);
  const [upcomingCheckOuts, setUpcomingCheckOuts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const loadDashboard = async () => {
      try {
        const [summaryRes, upcomingRes, widgetsRes, pendingRes] = await Promise.all([
          checkInApi.get(SUMMARY_ENDPOINT),
          checkInApi.get(UPCOMING_ENDPOINT, { params: { page_num: 1, limit: 10 } }),
          checkInApi.get(WIDGETS_ENDPOINT),
          checkInApi.get(CHECK_OUTS_ENDPOINT, {
            params: { page_num: 1, limit: 10, filter_key: 'check_out_status', filter_value: 'Pending' },
          }),
        ]);

        if (cancelled) return;

        const summary = summaryRes.data?.data ?? {};
        setStats(mapStats(summary));
        setStatusOverview(mapStatusOverview(summary));
        setProgressSteps(mapProgressSteps(summary));
        setProgressSummary(mapProgressSummary(summary));

        const widgets = widgetsRes.data?.data ?? {};
        setOverviewCards(mapOverviewCards(widgets));

        const upcomingItems = upcomingRes.data?.data?.data ?? [];
        setUpcomingCheckOuts(upcomingItems.map(mapUpcomingItem));

        const pendingItems = pendingRes.data?.data?.data ?? [];
        setPendingCheckOuts(pendingItems.map(mapPendingRow));
      } catch (err) {
        const status = err?.response?.status;
        const detail = err?.response?.data?.detail || err?.response?.data?.message || err?.message || 'Unknown error';
        const msg = status ? `HTTP ${status}: ${detail}` : detail;
        console.error('Check-out dashboard fetch failed:', msg);
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
    overviewCards,
    pendingCheckOuts,
    progressSteps,
    progressSummary,
    stats,
    statusOverview,
    upcomingCheckOuts,
    loading,
    error,
  };
};
