export const rentalReportContent = {
  title: 'Property Reports',
  breadcrumb: 'Real Estate > Property Reports',
  totalProperties: '311 Properties',
  filterSummary: 'Show 15,780 Property',
};

export const rentalReportRows = [
  { id: '12345', title: '3BHK Apartment', type: 'Apartment', target: 'Family', addedBy: 'Ali', area: '1200', rooms: 4, features: 'Balcony, Modular Kitchen', rent: '1200 OMN', status: 'Active' },
  { id: '12345', title: '4BHK Villa', type: 'Apartment', target: 'Bachelor', addedBy: 'Sara', area: '1200', rooms: 3, features: 'Garden', rent: '1600 OMN', status: 'Active' },
  { id: '12345', title: '3BHK Apartment', type: 'Villa', target: 'Family', addedBy: 'Ali', area: '1800', rooms: 2, features: 'Balcony, Modular Kitchen', rent: '1100 OMN', status: 'Inactive' },
  { id: '12345', title: '3BHK Apartment', type: 'Apartment', target: 'Family', addedBy: 'Ali', area: '1000', rooms: 4, features: 'Kitchen', rent: '1200 OMN', status: 'Active' },
  { id: '12345', title: '4BHK Villa', type: 'Villa', target: 'Bachelor', addedBy: 'Sara', area: '800', rooms: 1, features: 'Balcony, Modular Kitchen', rent: '1100 OMN', status: 'Inactive' },
  { id: '12345', title: '4BHK Villa', type: 'Apartment', target: 'Family', addedBy: 'Sara', area: '1200', rooms: 2, features: 'Balcony, Modular Kitchen', rent: '1300 OMN', status: 'Active' },
  { id: '12345', title: '4BHK Villa', type: 'Villa', target: 'Bachelor', addedBy: 'Ali', area: '1600', rooms: 3, features: 'Balcony', rent: '1650 OMN', status: 'Active' },
  { id: '12345', title: '3BHK Apartment', type: 'Apartment', target: 'Family', addedBy: 'Sara', area: '1200', rooms: 4, features: 'Modular Kitchen', rent: '1800 OMN', status: 'Inactive' },
];

export const rentalReportFilters = {
  cities: ['Choose a city', 'Muscat', 'Nizwa', 'Salalah', 'Sohar'],
  propertyType: ['Residential', 'Commercial'],
  propertiesType: ['All Properties', 'Apartment', 'Villa', 'Warehouse', 'Commercial'],
  bedrooms: ['1 BHK', '2 BHK', '3 BHK'],
  accessibilityFeatures: ['Balcony', 'Parking', 'Spa', 'Pool', 'Restaurant', 'Fitness Club'],
  rentalFor: ['Bachelor', 'Family'],
  rentalStatus: ['Advance Received', 'Rent Received', 'Rent Pending'],
};
