// Static presentation metadata (icons/colors/labels) for the Check-In Dashboard widgets.
// Live values (amounts, counts, percentages) come from the dashboard APIs — see
// useCheckInDashboardController.js.

export const STAT_CARD_META = [
  {
    key: 'totalCheckIns',
    title: 'Total Check-Ins',
    icon: 'solar:calendar-date-bold-duotone',
    color: '#604ae3',
    bg: '#f0ebff',
  },
  {
    key: 'completed',
    title: 'Completed',
    icon: 'solar:chart-square-bold-duotone',
    color: '#58bd7d',
    bg: '#eaf8f0',
    changeKey: 'completedChangePercentage',
  },
  {
    key: 'inProgress',
    title: 'In Progress',
    icon: 'solar:user-plus-rounded-bold-duotone',
    color: '#ff8b3d',
    bg: '#fff3ec',
  },
  {
    key: 'pending',
    title: 'Pending',
    icon: 'solar:chart-2-bold-duotone',
    color: '#38c6cf',
    bg: '#eafafa',
  },
  {
    key: 'cancelled',
    title: 'Cancelled',
    icon: 'solar:chart-2-bold-duotone',
    color: '#e65f5c',
    bg: '#fdecec',
  },
];

export const STATUS_OVERVIEW_META = [
  { key: 'completed', label: 'Completed', color: '#47AD94' },
  { key: 'inProgress', label: 'In-Progress', color: '#6C63D6' },
  { key: 'pending', label: 'Pending', color: '#F4845F' },
  { key: 'cancelled', label: 'Canceled', color: '#F0D44A' },
];

export const WORKFLOW_META = [
  { key: 'visitScheduled', label: 'Visit Scheduled', dotColor: '#8DC63F', valueColor: '#4A90D9' },
  { key: 'inspectionCompleted', label: 'Inspection Completed', dotColor: '#4DC0D7', valueColor: '#E53935' },
  { key: 'agreementInProgress', label: 'Agreement in Progress', dotColor: '#F4A25D', valueColor: '#43A047' },
  { key: 'companySigned', label: 'Company Signed', dotColor: '#58B67A', valueColor: '#FB8C00' },
  { key: 'agreementCompleted', label: 'Agreement Completed', dotColor: '#8D67F0', valueColor: '#E91E8C' },
];

// propertyTypeOverview keys are dynamic (only property types with at least one
// check-in are returned by the API), so colors are assigned cyclically.
export const PROPERTY_TYPE_COLORS = ['#4CAF7D', '#C9A84C', '#6C63D6', '#E8E857', '#4DC0D7', '#F4845F', '#8D67F0', '#F0D44A'];
