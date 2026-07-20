export const occupancyReportStats = [
  { label: 'Total Properties', value: '311', icon: 'solar:calendar-date-bold-duotone', color: '#604ae3', bg: '#f0edff' },
  { label: 'Rented', value: '74', icon: 'solar:chart-square-bold-duotone', color: '#58bd7d', bg: '#eaf8f0', change: '44%' },
  { label: 'Vacant', value: '34', icon: 'solar:user-plus-rounded-bold-duotone', color: '#ff8b3d', bg: '#fff3ec' },
  { label: 'Booked', value: '26', icon: 'solar:chart-2-bold-duotone', color: '#38c6cf', bg: '#eafafa' },
  { label: 'Police', value: '08', icon: 'solar:chart-2-bold-duotone', color: '#e65f5c', bg: '#fdecec' },
];

export const occupancyReportFilters = {
  propertyTypes: ['Villa', 'Apartment', 'Warehouse', 'Commercial'],
  statuses: ['Booked', 'Vacant', 'Rented', 'Police'],
};

export const occupancyReportRows = [
  { srNo: '01', id: '12345', propertyName: '3BHK Apartment', type: 'Apartment', building: 'Ahmed Apt', unitNo: 'A 101', startDate: '10 May 2025', endDate: '10 May 2026', rent: '1200 OMR', status: 'Rented' },
  { srNo: '02', id: '12345', propertyName: '4BHK Villa', type: 'Apartment', building: 'Galaxy Residency', unitNo: 'A 102', startDate: '12 May 2025', endDate: '12 May 2026', rent: '1600 OMR', status: 'Booked' },
  { srNo: '03', id: '12345', propertyName: '3BHK Apartment', type: 'Villa', building: 'Star Residency', unitNo: 'A 103', startDate: '13 May 2025', endDate: '13 May 2026', rent: '1100 OMR', status: 'Booked' },
  { srNo: '04', id: '12345', propertyName: '3BHK Apartment', type: 'Apartment', building: 'West Residency', unitNo: 'A 104', startDate: '04 May 2025', endDate: '04 May 2026', rent: '1200 OMR', status: 'Rented' },
  { srNo: '05', id: '12345', propertyName: '4BHK Villa', type: 'Villa', building: 'White Residency', unitNo: 'B 105', startDate: '-', endDate: '-', rent: '1100 OMR', status: 'Vacant' },
  { srNo: '06', id: '12345', propertyName: '4BHK Villa', type: 'Apartment', building: 'Galaxy Residency', unitNo: 'B 106', startDate: '20 May 2025', endDate: '20 May 2026', rent: '1300 OMR', status: 'Police' },
  { srNo: '07', id: '12345', propertyName: '4BHK Villa', type: 'Villa', building: 'Onyx Residency', unitNo: 'B 107', startDate: '-', endDate: '-', rent: '1650 OMR', status: 'Vacant' },
  { srNo: '08', id: '12345', propertyName: '3BHK Apartment', type: 'Apartment', building: 'Pearl Residency', unitNo: 'C 108', startDate: '22 May 2025', endDate: '22 May 2026', rent: '1800 OMR', status: 'Rented' },
];
