// Static presentation metadata (icons/colors/labels) for the Check-Out Dashboard widgets.
// Live values (amounts, counts, percentages) come from the dashboard APIs — see
// useCheckOutDashboardController.js.

import dashboardIcon1 from '@/assets/icons/Dashboard1.png';
import dashboardIcon2 from '@/assets/icons/Dashboard2.png';
import dashboardIcon3 from '@/assets/icons/Dashboard3.png';
import dashboardIcon4 from '@/assets/icons/Dashboard4.png';
import dashboardIcon5 from '@/assets/icons/Dashboard5.png';

export const STAT_CARD_META = [
  { key: 'totalCheckOuts', title: 'Total Check-Outs', icon: dashboardIcon1 },
  { key: 'pendingCheckOuts', title: 'Pending Check-Outs', icon: dashboardIcon2 },
  { key: 'completedCheckOuts', title: 'Completed Check-Outs', icon: dashboardIcon3 },
  { key: 'pendingSettlements', title: 'Pending Settlements', icon: dashboardIcon4 },
  { key: 'overdueCheckOuts', title: 'Overdue Check-Outs', icon: dashboardIcon5 },
];

export const PROGRESS_STEP_META = [
  { key: 'requestRaised', label: 'Request Raised', icon: '📜', color: '#0b5599', bg: '#d8f2ff' },
  { key: 'inspection', label: 'Inspection', icon: '📋', color: '#4b167d', bg: '#e3d6ff' },
  { key: 'repairAndDamage', label: 'Repair & Damage', icon: '🛠️', color: '#245b12', bg: '#ffd8d8' },
  { key: 'utilityReading', label: 'Utility Reading', icon: '⚙️', color: '#93420d', bg: '#d6ffd8' },
  { key: 'settlement', label: 'Settlement', icon: '🏦', color: '#b31435', bg: '#fbd4ff' },
  { key: 'completed', label: 'Completed', icon: '✅', color: '#1e8b1e', bg: '#ffe9cc' },
];

export const STATUS_OVERVIEW_META = [
  { key: 'completed', label: 'Completed', color: '#47AD94' },
  { key: 'inProgress', label: 'In-Progress', color: '#6C63D6' },
  { key: 'pending', label: 'Pending', color: '#F4845F' },
  { key: 'overdue', label: 'Overdue', color: '#E5E536' },
];

export const OVERVIEW_CARD_META = [
  {
    key: 'financialOverview',
    title: 'Financial Overview',
    icon: 'solar:wallet-money-bold-duotone',
    iconColor: '#7d4c2d',
    iconBg: '#e8f0ff',
    footer: 'View Financial Details',
    rows: [
      { key: 'totalPendingAmount', label: 'Total Pending Amount', stacked: true, money: true },
      { key: 'collectedThisMonth', label: 'Collected This Month', money: true },
    ],
  },
  {
    key: 'topDamageCategories',
    title: 'Top Damage Categories',
    icon: 'solar:checklist-minimalistic-bold-duotone',
    iconColor: '#df7d2f',
    iconBg: '#e8f0ff',
    footer: 'View Damage Reports',
  },
  {
    key: 'utilityOverview',
    title: 'Utility Overview',
    icon: 'solar:danger-triangle-bold-duotone',
    iconColor: '#f0bf12',
    iconBg: '#e8f0ff',
    footer: 'View Utility Readings',
    rows: [
      { key: 'totalUtility', label: 'Total Utility' },
      { key: 'pendingReadings', label: 'Pending Readings' },
      { key: 'paidReadings', label: 'Paid Readings' },
      { key: 'otherPending', label: 'Other Pending' },
    ],
  },
  {
    key: 'keyReturnStatus',
    title: 'Key Return Status',
    icon: 'solar:key-bold-duotone',
    iconColor: '#e5b300',
    iconBg: '#e8f0ff',
    footer: 'View Key Returns',
    rows: [
      { key: 'totalKeysIssued', label: 'Total Keys Issued' },
      { key: 'keysReturned', label: 'Keys Returned' },
      { key: 'keysPending', label: 'Keys Pending' },
    ],
  },
];
