export const dashboardStats = [
  {
    title: 'Total Check-Ins',
    amount: '128',
    icon: 'solar:calendar-date-bold-duotone',
    color: '#604ae3',
    bg: '#f0ebff',
  },
  {
    title: 'Completed',
    amount: '72',
    icon: 'solar:chart-square-bold-duotone',
    color: '#58bd7d',
    bg: '#eaf8f0',
    change: '44%',
  },
  {
    title: 'In Progress',
    amount: '32',
    icon: 'solar:user-plus-rounded-bold-duotone',
    color: '#ff8b3d',
    bg: '#fff3ec',
  },
  {
    title: 'Pending',
    amount: '14',
    icon: 'solar:chart-2-bold-duotone',
    color: '#38c6cf',
    bg: '#eafafa',
  },
  {
    title: 'Cancelled',
    amount: '6',
    icon: 'solar:chart-2-bold-duotone',
    color: '#e65f5c',
    bg: '#fdecec',
  },
];

export const dashboardStatusColors = {
  Completed: '#47ad94',
  'In Progress': '#604ae3',
  Pending: '#ff9b43',
};

export const dashboardStatusOverview = [
  { label: 'Completed', value: 82, color: '#47AD94', display: '82.00%' },
  { label: 'In-Progress', value: 42, color: '#6C63D6', display: '42.00%' },
  { label: 'Pending', value: 12, color: '#F4845F', display: '12.00%' },
  { label: 'Canceled', value: 6, color: '#F0D44A', display: '06.00%' },
];

export const dashboardPropertyTypes = [
  { label: 'Villa', value: 18, color: '#4CAF7D' },
  { label: 'Apartment', value: 38, color: '#C9A84C' },
  { label: 'Flat', value: 26, color: '#6C63D6' },
  { label: 'Commercial', value: 42, color: '#E8E857' },
];

export const dashboardWorkflowSteps = [
  { label: 'Visit Scheduled', value: 118, dotColor: '#8DC63F', valueColor: '#4A90D9' },
  { label: 'Inspection Completed', value: 111, dotColor: '#4DC0D7', valueColor: '#E53935' },
  { label: 'Agreement in Progress', value: 89, dotColor: '#F4A25D', valueColor: '#43A047' },
  { label: 'Company Signed', value: 78, dotColor: '#58B67A', valueColor: '#FB8C00' },
  { label: 'Agreement Completed', value: 68, dotColor: '#8D67F0', valueColor: '#E91E8C' },
];

export const dashboardRentPaymentSummary = [
  { id: 'CHK-123-6589', tenant: 'Mohammad Ali', property: 'B-105 Pearl Residency', date: '27 January 2025', status: 'Completed', assigned: 'John D.' },
  { id: 'CHK-123-6589', tenant: 'Shaikh Armaan', property: 'A-456 AZ Apartment', date: '28 May 2025', status: 'In Progress', assigned: 'Shounak S.' },
  { id: 'CHK-123-6589', tenant: 'Khan Daniyal', property: 'V-12 Royal Villa', date: '29 August 2025', status: 'Pending', assigned: 'Kartik D.' },
  { id: 'CHK-123-6589', tenant: 'Abdul Awf', property: 'S-08 Star Studio', date: '30 May 2025', status: 'Completed', assigned: 'Pranit P.' },
  { id: 'CHK-123-6589', tenant: 'Fatima Zahra', property: 'Z Residency', date: '25 April 2025', status: 'Completed', assigned: 'Harshal P.' },
  { id: 'CHK-123-6589', tenant: 'Rahul Sharma', property: 'Galaxy Apartment', date: '12 July 2025', status: 'Completed', assigned: 'Meet C.' },
];

export const dashboardUpcomingCheckIns = [
  { day: '01', month: 'June', property: 'A-101, Ocean View', tenant: 'Bilal Ahmed', time: '10:00 AM', assignedTo: 'John D.', avatar: 'https://i.pravatar.cc/36?img=11' },
  { day: '15', month: 'June', property: 'B-203 Star Residency', tenant: 'Abdul Kareem', time: '11:15 AM', assignedTo: 'Salman R.', avatar: 'https://i.pravatar.cc/36?img=52' },
  { day: '24', month: 'June', property: 'C-563 Rainforest Villa', tenant: 'Arzaan Shaikh', time: '13:30 PM', assignedTo: 'Ahmed Khan', avatar: 'https://i.pravatar.cc/36?img=33' },
];
