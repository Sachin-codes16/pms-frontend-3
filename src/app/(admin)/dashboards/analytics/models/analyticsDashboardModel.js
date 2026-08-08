// Static presentation metadata (icons/colors/labels) for the Main Dashboard widgets.
// Live values (amounts, counts, percentages) come from the dashboard APIs — see
// useAnalyticsDashboardController.js.

import dashboardIcon1 from '@/assets/icons/Dashboard1.png';
import dashboardIcon2 from '@/assets/icons/Dashboard2.png';
import dashboardIcon3 from '@/assets/icons/Dashboard3.png';
import dashboardIcon4 from '@/assets/icons/Dashboard4.png';
import dashboardIcon5 from '@/assets/icons/Dashboard5.png';

export const STAT_CARD_META = [
  { key: 'totalCheckIns', title: 'Total Check-Ins', icon: dashboardIcon1, variant: 'primary' },
  { key: 'pendingCheckIns', title: 'Pending Check-Ins', icon: dashboardIcon2, variant: 'success' },
  { key: 'totalCheckOuts', title: 'Total Check-Outs', icon: dashboardIcon3, variant: 'warning' },
  { key: 'pendingCheckOuts', title: 'Pending Check-Outs', icon: dashboardIcon4, variant: 'info' },
];

export const PENDING_SETTLEMENTS_STAT_META = {
  title: 'Pending Settlements',
  icon: dashboardIcon5,
  variant: 'danger',
};

export const STATUS_OVERVIEW_META = [
  { key: 'checkedIn', label: 'Checked-In', color: '#58bf7d' },
  { key: 'checkedOut', label: 'Checked-Out', color: '#604ae3' },
  { key: 'pendingCheckIn', label: 'Pending Check-In', color: '#ff9142' },
  { key: 'pendingCheckOut', label: 'Pending Check-Out', color: '#e6ed3f' },
];
