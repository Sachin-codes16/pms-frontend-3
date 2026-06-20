export const checkOutDashboardStats = [
  { title: 'Total Check-Outs', amount: '128', icon: 'solar:calendar-date-bold-duotone', color: '#604ae3', bg: '#f0ebff' },
  { title: 'Pending Check-Outs', amount: '72', icon: 'solar:chart-square-bold-duotone', color: '#58bd7d', bg: '#eaf8f0' },
  { title: 'Completed Check-Outs', amount: '32', icon: 'solar:user-plus-rounded-bold-duotone', color: '#ff8b3d', bg: '#fff3ec' },
  { title: 'Pending Settlements', amount: '14', icon: 'solar:chart-2-bold-duotone', color: '#38c6cf', bg: '#eafafa' },
  { title: 'Overdue Check-Outs', amount: '6', icon: 'solar:chart-2-bold-duotone', color: '#e65f5c', bg: '#fdecec' },
];

export const checkOutProgressSteps = [
  { label: 'Request Raised', value: '24', icon: '📜', color: '#0b5599', bg: '#d8f2ff' },
  { label: 'Inspection', value: '14', icon: '📋', color: '#4b167d', bg: '#e3d6ff' },
  { label: 'Repair & Damage', value: '8', icon: '🛠️', color: '#245b12', bg: '#ffd8d8' },
  { label: 'Utility Reading', value: '10', icon: '⚙️', color: '#93420d', bg: '#d6ffd8' },
  { label: 'Settlement', value: '6', icon: '🏦', color: '#b31435', bg: '#fbd4ff' },
  { label: 'Completed', value: '12', icon: '✅', color: '#1e8b1e', bg: '#ffe9cc' },
];

export const checkOutProgressSummary = {
  percent: 65,
  label: '65% Completed',
};

export const checkOutStatusOverview = [
  { label: 'Completed', value: 82, color: '#47AD94', display: '82.00%' },
  { label: 'In-Progress', value: 42, color: '#6C63D6', display: '42.00%' },
  { label: 'Pending', value: 12, color: '#F4845F', display: '12.00%' },
  { label: 'Overdue', value: 6, color: '#E5E536', display: '06.00%' },
];

export const pendingCheckOuts = [
  { id: 'CHK-123-6589', tenant: 'Mohammad Ali', property: 'B-105 Pearl Residency', date: '27 January 2025', status: 'Completed', daysLeft: 'Today' },
  { id: 'CHK-123-6589', tenant: 'Shaikh Armaan', property: 'A-456 AZ Apartment', date: '28 May 2025', status: 'In Progress', daysLeft: '2 Days' },
  { id: 'CHK-123-6589', tenant: 'Khan Daniyal', property: 'V-12 Royal Villa', date: '29 August 2025', status: 'Repair', daysLeft: '3 Days' },
  { id: 'CHK-123-6589', tenant: 'Abdul Awf', property: 'S-08 Star Studio', date: '30 May 2025', status: 'Completed', daysLeft: '4 Days' },
  { id: 'CHK-123-6589', tenant: 'Fatima Zahra', property: 'Z Residency', date: '25 April 2025', status: 'Settlement', daysLeft: '4 Days' },
  { id: 'CHK-123-6589', tenant: 'Rahul Sharma', property: 'Galaxy Apartment', date: '12 July 2025', status: 'Inspection', daysLeft: '5 Days' },
];

export const upcomingCheckOuts = [
  { day: '29', month: 'May', property: 'A-101, Ocean View', tenant: 'Bilal Ahmed', daysLeft: '3 Days', assignedTo: 'John D.', avatar: 'https://i.pravatar.cc/36?img=11' },
  { day: '12', month: 'April', property: 'B-203 Star Residency', tenant: 'Abdul Kareem', daysLeft: '5 Days', assignedTo: 'Salman R.', avatar: 'https://i.pravatar.cc/36?img=52' },
  { day: '26', month: 'June', property: 'C-563 Rainforest Villa', tenant: 'Arzaan Shaikh', daysLeft: '2 Days', assignedTo: 'Ahmed Khan', avatar: 'https://i.pravatar.cc/36?img=33' },
];

export const checkOutOverviewCards = [
  {
    title: 'Financial Overview',
    icon: 'solar:wallet-money-bold-duotone',
    iconColor: '#7d4c2d',
    iconBg: '#e8f0ff',
    footer: 'View Financial Details',
    rows: [
      { label: 'Total Pending Amount', value: '12354 OMR', stacked: true },
      { label: 'Collected This Month', value: '1234 OMR' },
    ],
  },
  {
    title: 'Top Damage Categories',
    icon: 'solar:checklist-minimalistic-bold-duotone',
    iconColor: '#df7d2f',
    iconBg: '#e8f0ff',
    footer: 'View Damage Reports',
    rows: [
      { label: 'Wall Damage', value: '5' },
      { label: 'Appliance Damage', value: '4' },
      { label: 'Floor Damage', value: '3' },
      { label: 'Other Damage', value: '2' },
    ],
  },
  {
    title: 'Utility Overview',
    icon: 'solar:danger-triangle-bold-duotone',
    iconColor: '#f0bf12',
    iconBg: '#e8f0ff',
    footer: 'View Utility Readings',
    rows: [
      { label: 'Total Utility', value: '5' },
      { label: 'Pending Readings', value: '4' },
      { label: 'Paid Readings', value: '3' },
      { label: 'Other Pending', value: '2' },
    ],
  },
  {
    title: 'Key Return Status',
    icon: 'solar:key-bold-duotone',
    iconColor: '#e5b300',
    iconBg: '#e8f0ff',
    footer: 'View Key Returns',
    rows: [
      { label: 'Total Keys Issued', value: '5' },
      { label: 'Keys Returned', value: '4' },
      { label: 'Keys Pending', value: '3' },
    ],
  },
];
