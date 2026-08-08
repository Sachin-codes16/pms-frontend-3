// Static presentation metadata (icons/colors/labels) for the Check-In Dashboard widgets.
// Live values (amounts, counts, percentages) come from the dashboard APIs — see
// useCheckInDashboardController.js.

import dashboardIcon1 from '@/assets/icons/Dashboard1.png';
import dashboardIcon2 from '@/assets/icons/Dashboard2.png';
import dashboardIcon3 from '@/assets/icons/Dashboard3.png';
import dashboardIcon4 from '@/assets/icons/Dashboard4.png';
import dashboardIcon5 from '@/assets/icons/Dashboard5.png';

export const STAT_CARD_META = [
  {
    key: 'totalCheckIns',
    title: 'Total Check-Ins',
    icon: dashboardIcon1,
  },
  {
    key: 'completed',
    title: 'Completed',
    icon: dashboardIcon2,
    changeKey: 'completedChangePercentage',
  },
  {
    key: 'inProgress',
    title: 'In Progress',
    icon: dashboardIcon3,
  },
  {
    key: 'pending',
    title: 'Pending',
    icon: dashboardIcon4,
  },
  {
    key: 'cancelled',
    title: 'Cancelled',
    icon: dashboardIcon5,
  },
];

export const STATUS_OVERVIEW_META = [
  { key: 'completed', label: 'Completed', color: '#47AD94' },
  { key: 'inProgress', label: 'In-Progress', color: '#6C63D6' },
  { key: 'pending', label: 'Pending', color: '#F4845F' },
  { key: 'cancelled', label: 'Canceled', color: '#F0D44A' },
];

// Each step now shows a real date pulled from the most recent check-in's own
// record (see useCheckInDashboardController.js), not an aggregate count.
// getDate(record) reads the field that backs that step; agreementCompleted has
// no dedicated backend field, so tenantSignedOn (final signature) is used as
// the closest real completion signal.
export const WORKFLOW_META = [
  { key: 'visitScheduled', label: 'Visit Scheduled', dotColor: '#8DC63F', valueColor: '#4A90D9', getDate: (r) => r?.inspectionDate },
  { key: 'inspectionCompleted', label: 'Inspection Completed', dotColor: '#4DC0D7', valueColor: '#E53935', getDate: (r) => r?.inspection?.inspectionOverview?.inspectionDate },
  { key: 'agreementInProgress', label: 'Agreement in Progress', dotColor: '#F4A25D', valueColor: '#43A047', getDate: (r) => r?.agreement?.agreementDetails?.generatedOn },
  { key: 'companySigned', label: 'Company Signed', dotColor: '#58B67A', valueColor: '#FB8C00', getDate: (r) => r?.agreement?.agreementDetails?.managerSignedOn },
  { key: 'agreementCompleted', label: 'Agreement Completed', dotColor: '#8D67F0', valueColor: '#E91E8C', getDate: (r) => r?.agreement?.agreementDetails?.tenantSignedOn },
];

// propertyTypeOverview now always includes every known rental type (Flat, Commercial,
// Villa, Warehouse) at 0 when absent, so each gets a stable, fixed color. Any future
// unknown type falls back to cycling through FALLBACK_PROPERTY_TYPE_COLORS.
export const PROPERTY_TYPE_COLOR_MAP = {
  Villa: '#4CAF7D',
  Apartment: '#C9A84C',
  Flat: '#6C63D6',
  Commercial: '#E8E857',
  Warehouse: '#4DC0D7',
};
export const FALLBACK_PROPERTY_TYPE_COLORS = ['#F4845F', '#8D67F0', '#F0D44A'];
