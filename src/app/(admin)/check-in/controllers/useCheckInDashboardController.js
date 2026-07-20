import checkInApi from '@/helpers/checkInApi';
import { fmtDate } from '@/utils/checkInFormat';
import { useEffect, useState } from 'react';
import {
  PROPERTY_TYPE_COLORS,
  STATUS_OVERVIEW_META,
  STAT_CARD_META,
  WORKFLOW_META,
} from '../models/checkInDashboardModel';

const SUMMARY_ENDPOINT = '/checkin-checkout/check_in/dashboard/summary/';
const UPCOMING_ENDPOINT = '/checkin-checkout/check_in/dashboard/upcoming/';
const CHECK_INS_ENDPOINT = '/checkin-checkout/check_in/get_all/';

// GET /checkin-checkout/check_in/dashboard/summary/ response shape:
// { data: { totalCheckIns, completed, completedChangePercentage, inProgress, pending, cancelled,
//   statusOverview: { completed:{count,percentage}, inProgress:{...}, pending:{...}, cancelled:{...} },
//   propertyTypeOverview: { [propertyType: string]: count },
//   workflow: { visitScheduled, inspectionCompleted, agreementInProgress, companySigned, agreementCompleted } } }
const mapStats = (summary = {}) =>
  STAT_CARD_META.map((meta) => ({
    title: meta.title,
    amount: String(summary[meta.key] ?? 0),
    icon: meta.icon,
    color: meta.color,
    bg: meta.bg,
    change: meta.changeKey && summary[meta.changeKey] ? `${Math.abs(summary[meta.changeKey]).toFixed(0)}%` : undefined,
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

const mapPropertyTypes = (summary = {}) => {
  const overview = summary.propertyTypeOverview ?? {};
  return Object.entries(overview).map(([label, value], idx) => ({
    label,
    value: value ?? 0,
    color: PROPERTY_TYPE_COLORS[idx % PROPERTY_TYPE_COLORS.length],
  }));
};

const mapWorkflowSteps = (summary = {}) =>
  WORKFLOW_META.map((meta) => ({
    label: meta.label,
    value: summary.workflow?.[meta.key] ?? 0,
    dotColor: meta.dotColor,
    valueColor: meta.valueColor,
  }));

// GET /checkin-checkout/check_in/get_all/ response shape:
// { data: { data: CheckInListItem[], presentPage, totalPage } }
const mapRentPaymentRow = (item) => ({
  id: item.checkInId,
  tenant: item.tenantName || '—',
  property: [item.buildingName, item.flatUnitNumber].filter(Boolean).join(' - ') || '—',
  date: fmtDate(item.checkInDate),
  status: item.checkInStatus || '—',
  assigned: item.assignedEmployee?.name || '—',
});

// GET /checkin-checkout/check_in/dashboard/upcoming/ response shape:
// { data: { data: UpcomingCheckInItem[], presentPage, totalPage } }
// NOTE: item field names are unverified — the endpoint returns an empty list on the
// only account tested (no check-in has a future checkInDate). Mapped defensively
// using the field-naming convention confirmed on get_all/. See BACKEND_NOTES.md.
const mapUpcomingItem = (item) => {
  const rawDate = item.checkInDate || item.scheduledDate || item.date || null;
  const parsedDate = rawDate ? new Date(rawDate) : null;
  const validDate = parsedDate && !Number.isNaN(parsedDate.getTime());

  return {
    day: validDate ? String(parsedDate.getDate()).padStart(2, '0') : '--',
    month: validDate ? parsedDate.toLocaleString('en-US', { month: 'long' }) : '—',
    property: [item.buildingName, item.flatUnitNumber].filter(Boolean).join(' - ') || item.property || '—',
    tenant: item.tenantName || item.tenant || '—',
    time:
      item.checkInTime ||
      item.time ||
      (validDate ? parsedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—'),
    assignedTo: item.assignedEmployee?.name || item.assignedTo || '—',
    avatar: item.assignedEmployee?.avatar || item.avatar || null,
  };
};

export const useCheckInDashboardController = () => {
  const [stats, setStats] = useState([]);
  const [statusOverview, setStatusOverview] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [workflowSteps, setWorkflowSteps] = useState([]);
  const [rentPaymentSummary, setRentPaymentSummary] = useState([]);
  const [upcomingCheckIns, setUpcomingCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const loadDashboard = async () => {
      try {
        const [summaryRes, upcomingRes, checkInsRes] = await Promise.all([
          checkInApi.get(SUMMARY_ENDPOINT),
          checkInApi.get(UPCOMING_ENDPOINT, { params: { page_num: 1, limit: 10 } }),
          checkInApi.get(CHECK_INS_ENDPOINT, { params: { page_num: 1, limit: 10 } }),
        ]);

        if (cancelled) return;

        const summary = summaryRes.data?.data ?? {};
        setStats(mapStats(summary));
        setStatusOverview(mapStatusOverview(summary));
        setPropertyTypes(mapPropertyTypes(summary));
        setWorkflowSteps(mapWorkflowSteps(summary));

        const upcomingItems = upcomingRes.data?.data?.data ?? [];
        setUpcomingCheckIns(upcomingItems.map(mapUpcomingItem));

        const checkInItems = checkInsRes.data?.data?.data ?? [];
        setRentPaymentSummary(checkInItems.map(mapRentPaymentRow));
      } catch (err) {
        const status = err?.response?.status;
        const detail = err?.response?.data?.detail || err?.response?.data?.message || err?.message || 'Unknown error';
        const msg = status ? `HTTP ${status}: ${detail}` : detail;
        console.error('Check-in dashboard fetch failed:', msg);
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
    propertyTypes,
    rentPaymentSummary,
    stats,
    statusOverview,
    upcomingCheckIns,
    workflowSteps,
    loading,
    error,
  };
};
