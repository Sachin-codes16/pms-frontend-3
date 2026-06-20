export const checkInRecords = [
  { id: 'CHK-123-6589', tenant: 'Mohammad Ali', property: 'B-105 Pearl Residency', type: 'Apartment', date: '27 January 2025', status: 'Completed', assigned: 'John D.', avatar: 'https://i.pravatar.cc/36?img=11' },
  { id: 'CHK-123-6590', tenant: 'Shaikh Armaan', property: 'A-456 AZ Apartment', type: 'Apartment', date: '28 May 2025', status: 'In Progress', assigned: 'Shounak S.', avatar: 'https://i.pravatar.cc/36?img=12' },
  { id: 'CHK-123-6591', tenant: 'Khan Daniyal', property: 'V-12 Royal Villa', type: 'Villa', date: '29 August 2025', status: 'Pending', assigned: 'Kartik D.', avatar: 'https://i.pravatar.cc/36?img=13' },
  { id: 'CHK-123-6592', tenant: 'Abdul Awf', property: 'S-08 Star Studio', type: 'Flat', date: '30 May 2025', status: 'Completed', assigned: 'Pranit P.', avatar: 'https://i.pravatar.cc/36?img=14' },
  { id: 'CHK-123-6593', tenant: 'Fatima Zahra', property: 'Z Residency', type: 'Apartment', date: '25 April 2025', status: 'Completed', assigned: 'Harshal P.', avatar: 'https://i.pravatar.cc/36?img=15' },
  { id: 'CHK-123-6594', tenant: 'Rahul Sharma', property: 'Galaxy Apartment', type: 'Apartment', date: '12 July 2025', status: 'Completed', assigned: 'Meet C.', avatar: 'https://i.pravatar.cc/36?img=16' },
  { id: 'CHK-123-6595', tenant: 'Bilal Ahmed', property: 'A-101, Ocean View', type: 'Flat', date: '01 June 2025', status: 'In Progress', assigned: 'John D.', avatar: 'https://i.pravatar.cc/36?img=17' },
  { id: 'CHK-123-6596', tenant: 'Abdul Kareem', property: 'B-203 Star Residency', type: 'Apartment', date: '15 June 2025', status: 'Pending', assigned: 'Salman R.', avatar: 'https://i.pravatar.cc/36?img=18' },
];

export const checkInStats = [
  { label: 'Total Check-Ins', value: 128, icon: 'solar:calendar-date-bold-duotone', color: '#604ae3', bg: '#f0edff' },
  { label: 'Completed', value: 72, icon: 'solar:check-circle-bold-duotone', color: '#47ad94', bg: '#e8f7f2' },
  { label: 'In Progress', value: 32, icon: 'solar:clock-circle-bold-duotone', color: '#ff9b43', bg: '#fff4e8' },
  { label: 'Pending', value: 14, icon: 'solar:hourglass-bold-duotone', color: '#46c6d8', bg: '#eafafb' },
];

export const checkInStatusStyles = {
  Completed: { color: '#22a06b', bg: '#e4f7ef' },
  'In Progress': { color: '#604ae3', bg: '#eee9ff' },
  Pending: { color: '#ff8a3d', bg: '#fff0df' },
};

export const checkInStatusOptions = ['All', 'Completed', 'In Progress', 'Pending'];

export const checkInTypeOptions = ['All', 'Apartment', 'Villa', 'Flat'];
