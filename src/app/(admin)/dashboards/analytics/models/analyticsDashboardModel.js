// Static presentation metadata (icons/colors/labels) for the Main Dashboard widgets.
// Live values (amounts, counts, percentages) come from the dashboard APIs — see
// useAnalyticsDashboardController.js.

export const STAT_CARD_META = [
  { key: 'totalCheckIns', title: 'Total Check-Ins', icon: 'solar:calendar-date-bold-duotone', variant: 'primary' },
  { key: 'pendingCheckIns', title: 'Pending Check-Ins', icon: 'solar:chart-square-bold-duotone', variant: 'success' },
  { key: 'totalCheckOuts', title: 'Total Check-Outs', icon: 'solar:user-plus-rounded-bold-duotone', variant: 'warning' },
  { key: 'pendingCheckOuts', title: 'Pending Check-Outs', icon: 'solar:chart-2-bold-duotone', variant: 'info' },
];

export const PENDING_SETTLEMENTS_STAT_META = {
  title: 'Pending Settlements',
  icon: 'solar:chart-bold-duotone',
  variant: 'danger',
};

export const STATUS_OVERVIEW_META = [
  { key: 'checkedIn', label: 'Checked-In', color: '#58bf7d' },
  { key: 'checkedOut', label: 'Checked-Out', color: '#604ae3' },
  { key: 'pendingCheckIn', label: 'Pending Check-In', color: '#ff9142' },
  { key: 'pendingCheckOut', label: 'Pending Check-Out', color: '#e6ed3f' },
];
