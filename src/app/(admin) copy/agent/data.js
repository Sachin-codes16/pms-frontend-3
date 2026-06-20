import { getCookie } from 'cookies-next';
import { API_BASE_URL } from '@/constants/api';

function getToken() {
  try {
    const raw = getCookie('_LAHOMES_AUTH_KEY_')?.toString();
    if (!raw) return '';
    return JSON.parse(raw)?.token || '';
  } catch {
    return '';
  }
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  };
}

/** GET /property/count/ */
export const fetchTotalPropertyCount = async () => {
  const res = await fetch(`${API_BASE_URL}/property/count/`, {
    headers: authHeaders(),
  });
  const json = await res.json();
  return json?.data?.count ?? 0;
};

/** GET /property/count/?filter_key=property_type&filter_value={type} */
export const fetchPropertyCountByType = async (type) => {
  const res = await fetch(
    `${API_BASE_URL}/property/count/?filter_key=property_type&filter_value=${encodeURIComponent(type)}`,
    { headers: authHeaders() }
  );
  const json = await res.json();
  return json?.data?.count ?? 0;
};

const LANDLORD_PURPOSES = ['landlord', 'owner', 'company'];

export const fetchLandlordCount = async () => {
  const counts = await Promise.all(
    LANDLORD_PURPOSES.map(async (purpose) => {
      const res = await fetch(
        `${API_BASE_URL}/lead/count/?filter_key=purpose&filter_value=${encodeURIComponent(purpose)}`,
        { headers: authHeaders() }
      );
      const json = await res.json();
      return json?.data?.count ?? 0;
    })
  );
  return counts.reduce((acc, c) => acc + c, 0);
};

const INVALID_VALUES = ['', '-', 'n/a', 'null', 'undefined', '0', 'none', 'na'];

const isValid = (val) =>
  val &&
  typeof val === 'string' &&
  val.trim().length > 1 &&
  !INVALID_VALUES.includes(val.trim().toLowerCase());

export const extractCountry = (property) => {
  // PRIMARY: direct top-level fields (confirmed in Postman)
  if (isValid(property?.country))      return property.country.trim();
  if (isValid(property?.Country))      return property.Country.trim();
  if (isValid(property?.country_name)) return property.country_name.trim();
  if (isValid(property?.countryName))  return property.countryName.trim();

  // FALLBACK: nested type-specific objects
  const nested = [
    property?.villaData?.country,
    property?.flatData?.country,
    property?.warehouseData?.country,
    property?.commercialData?.country,
    property?.rowHouseData?.country,
    property?.rowhouseData?.country,
    property?.addressData?.country,
    property?.address?.country,
    property?.location?.country,
  ];
  for (const val of nested) {
    if (isValid(val)) return val.trim();
  }

  return null;
};

/**
 * Fetch all properties — with detailed logs to verify API response structure.
 */
export const fetchAllProperties = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/property/get_all/`, {
      headers: authHeaders(),
    });
    const json = await res.json();

    // Log raw response shape
    console.log('[API] Raw json keys:', Object.keys(json ?? {}));
    console.log('[API] json.data keys:', Object.keys(json?.data ?? {}));

    const properties = json?.data?.data ?? [];

    if (properties.length) {
      const first = properties[0];
      console.log('[API] Total properties fetched:', properties.length);
      console.log('[API] First property keys:', Object.keys(first));
      console.log('[API] first.country =', first?.country);
      console.log('[API] extractCountry(first) =', extractCountry(first));
    } else {
      console.warn('[API] ⚠️ Properties array is EMPTY!');
      console.warn('[API] Full response:', JSON.stringify(json, null, 2));
    }

    return properties;
  } catch (error) {
    console.error('[API] Error fetching properties:', error);
    return [];
  }
};

// ─── Country → map coordinates [lat, lng] ────────────────────────────────────
export const COUNTRY_COORDS = {
  'Oman':                 [23.6139,  58.5922],
  'UAE':                  [23.4241,  53.8478],
  'United Arab Emirates': [23.4241,  53.8478],
  'Saudi Arabia':         [23.8859,  45.0792],
  'Kuwait':               [29.3117,  47.4818],
  'Bahrain':              [26.0667,  50.5577],
  'Qatar':                [25.3548,  51.1839],
  'Jordan':               [30.5852,  36.2384],
  'India':                [20.5937,  78.9629],
  'Pakistan':             [30.3753,  69.3451],
  'Bangladesh':           [23.6850,  90.3563],
  'Kenya':                [-1.2921,  36.8219],
  'UK':                   [55.3781,  -3.4360],
  'United Kingdom':       [55.3781,  -3.4360],
  'USA':                  [37.0902, -95.7129],
  'United States':        [37.0902, -95.7129],
  'China':                [35.8617, 104.1954],
  'Germany':              [51.1657,  10.4515],
  'France':               [46.2276,   2.2137],
  'Canada':               [56.1304, -106.3468],
  'Australia':            [-25.2744, 133.7751],
};

// ─── Country → Iconify flag icon ─────────────────────────────────────────────
const COUNTRY_FLAG_ICONS = {
  'Oman':                 'circle-flags:om',
  'UAE':                  'circle-flags:ae',
  'United Arab Emirates': 'circle-flags:ae',
  'Saudi Arabia':         'circle-flags:sa',
  'Kuwait':               'circle-flags:kw',
  'Bahrain':              'circle-flags:bh',
  'Qatar':                'circle-flags:qa',
  'Jordan':               'circle-flags:jo',
  'India':                'circle-flags:in',
  'Pakistan':             'circle-flags:pk',
  'Bangladesh':           'circle-flags:bd',
  'Kenya':                'circle-flags:ke',
  'USA':                  'circle-flags:us',
  'United States':        'circle-flags:us',
  'UK':                   'circle-flags:gb',
  'United Kingdom':       'circle-flags:gb',
  'China':                'circle-flags:cn',
  'Germany':              'circle-flags:de',
  'France':               'circle-flags:fr',
  'Canada':               'circle-flags:ca',
  'Australia':            'circle-flags:au',
};

const VARIANTS = ['secondary', 'info', 'warning', 'success'];

/**
 * Fetches top 4 countries by property count with percentage + map coords.
 */
export const fetchCountryPropertyStats = async () => {
  try {
    const properties = await fetchAllProperties();
    if (!properties.length) return [];

    const countMap = {};
    for (const property of properties) {
      const country = extractCountry(property) ?? 'Oman';
      countMap[country] = (countMap[country] ?? 0) + 1;
    }

    console.log('[fetchCountryPropertyStats] Country counts:', countMap);

    const total = properties.length;
    const top4 = Object.entries(countMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);

    return top4.map(([country, count], idx) => ({
      country,
      count,
      progress: parseFloat(((count / total) * 100).toFixed(2)),
      variant: VARIANTS[idx] ?? 'primary',
      icon: COUNTRY_FLAG_ICONS[country] ?? 'circle-flags:un',
      coords: COUNTRY_COORDS[country] ?? null,
    }));
  } catch (error) {
    console.error('Error in fetchCountryPropertyStats:', error);
    return [];
  }
};

/** Finds the landlord with the most properties. */
export const fetchTopLandlord = async () => {
  try {
    const [properties, leadRes] = await Promise.all([
      fetchAllProperties(),
      fetch(`${API_BASE_URL}/lead/get_all/`, { headers: authHeaders() }),
    ]);
    const leadsJson = await leadRes.json();
    const allLeads = leadsJson?.data?.data ?? [];
    if (!properties.length || !allLeads.length) return null;

    const landlords = allLeads.filter(lead =>
      LANDLORD_PURPOSES.includes(lead?.purpose?.toLowerCase())
    );
    if (!landlords.length) return null;

    const countMap = {};
    for (const property of properties) {
      const landlordId = property?.landlord_id;
      if (!landlordId) continue;
      countMap[landlordId] = (countMap[landlordId] ?? 0) + 1;
    }
    if (!Object.keys(countMap).length) return null;

    const topLandlordId = Number(
      Object.entries(countMap).reduce(
        (best, [id, count]) => (count > best[1] ? [id, count] : best),
        ['', 0]
      )[0]
    );
    if (!topLandlordId) return null;

    const topLead = landlords.find(lead => Number(lead.leadId) === topLandlordId);
    if (!topLead) return null;

    return {
      leadId: topLead.leadId,
      name: `${topLead.firstName ?? ''} ${topLead.lastName ?? ''}`.trim(),
      city: topLead.city ?? '',
      country: topLead.country ?? '',
      propertyCount: countMap[topLandlordId],
      phoneNumber: topLead.phoneNumber ?? '',
    };
  } catch (error) {
    console.error('Error in fetchTopLandlord:', error);
    return null;
  }
};

/** Fetches the 5 most recently created properties. */
export const fetchRecentProperties = async () => {
  try {
    const properties = await fetchAllProperties();
    const sorted = [...properties].sort((a, b) =>
      new Date(b?.createdAt ?? 0) - new Date(a?.createdAt ?? 0)
    );
    return sorted.slice(0, 5).map(property => ({
      propertyId:   property.propertyId ?? null,
      propertyType: property.propertyType ?? property.property_type ?? '—',
      rentalType:   property.rentalType ?? property.rental_type ?? '—',
      expectedRent: property.expectedRent ?? property.expected_rent ?? '—',
      city:         property.city ?? property.property_details?.city ?? '—',
      country:      extractCountry(property) ?? '—',
      createdAt:    property.createdAt ?? property.created_at ?? null,
      assignedTo:   property.assignedTo?.name ?? property.assigned_to?.name ?? '—',
      photo:        property.photos?.[0] ?? property.photo ?? null,
      
      // Include nested property_details
      property_details: property.property_details ?? null,
      
      // Flat-specific data
      flat_data: property.flat_data ?? null,
      flatNumber: property.flatNumber ?? property.flat_number ?? property.flat_data?.flat_number ?? '—',
      block: property.block ?? property.flat_data?.building_block ?? '—',
      
      // Villa-specific data
      villa_data: property.villa_data ?? null,
      villaName: property.villaName ?? property.villa_name ?? property.villa_data?.villa_name ?? null,
      
      // Commercial-specific data
      commercial_data: property.commercial_data ?? null,
      
      // Common building names
      buildingName: property.buildingName ?? property.building_name ?? property.property_details?.building_name ?? null,
      buildingDetails: property.buildingDetails ?? property.building_details ?? null,
      complexName: property.complexName ?? property.complex_name ?? null,
      warehouseName: property.warehouseName ?? property.warehouse_name ?? null,
    }));
  } catch (error) {
    console.error('Error in fetchRecentProperties:', error);
    throw error;
  }
};

// ─── Static shape data ───────────────────────────────────────────────────────
export const statData = [
  { title: 'No. of landlords',  amount: '—', icon: 'solar:calendar-date-broken', variant: 'primary',  fetchKey: 'landlords' },
  { title: 'No. of properties', amount: '—', icon: 'solar:graph-new-broken',     variant: 'success',  fetchKey: 'total' },
  { title: 'Commercial',        amount: '—', icon: 'solar:user-plus-broken',      variant: 'warning',  fetchKey: 'commercial' },
  { title: 'Warehouse',         amount: '—', icon: 'solar:chart-2-broken',        variant: 'info',     fetchKey: 'warehouse' },
];

export const revenueData = [
  { title: 'Apartment', amount: '—', progress: 40, variant: 'primary', fetchKey: 'flat' },
  { title: 'Villa',     amount: '—', progress: 30, variant: 'warning', fetchKey: 'villa' },
  { title: 'Warehouse', amount: '—', progress: 20, variant: 'success', fetchKey: 'warehouse' },
  { title: 'Rowhouse',  amount: '—', progress: 20, variant: 'info',    fetchKey: 'rowhouse' },
];

export const countryData = [];

export const salesFunnelOptions = {
  chart: { type: 'area', height: 165, sparkline: { enabled: true } },
  series: [{ data: [25, 66, 41, 89, 63, 25, 44, 12, 36, 9, 54] }],
  stroke: { width: 2, curve: 'smooth' },
  fill: { type: 'gradient', gradient: { shade: 'light', type: 'vertical', opacityFrom: 0.4, opacityTo: 0, stops: [0, 100] } },
  markers: { size: 0 },
  colors: ['#604ae3'],
  tooltip: { fixed: { enabled: false }, x: { show: false }, y: { title: { formatter: () => '' } }, marker: { show: false } },
};

export const agentOptions = {
  series: [
    { name: 'Property Sales', type: 'bar',  data: [89.25, 98.58, 68.74, 108.87, 77.54, 84.03, 51.24, 28.57, 92.57, 42.36, 88.51, 36.57] },
    { name: 'Profit Ratio',   type: 'line', data: [35, 35, 25, 25, 45, 45, 75, 75, 45, 45, 54, 54] },
  ],
  chart: { height: 330, type: 'line', toolbar: { show: false } },
  stroke: { curve: 'straight', dashArray: [0, 8], width: [0, 2] },
  fill: { opacity: [4, 1] },
  markers: { size: [0, 0], strokeWidth: 2, hover: { size: 4 } },
  xaxis: { categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], axisTicks: { show: false }, axisBorder: { show: false } },
  grid: { show: true, xaxis: { lines: { show: true } }, yaxis: { lines: { show: false } }, padding: { top: 0, right: -2, bottom: 15, left: 10 } },
  legend: { show: false },
  plotOptions: { bar: { columnWidth: '30%', barHeight: '100%', borderRadius: 8 } },
  colors: ['#604ae3', '#f8ac59'],
  tooltip: {
    shared: true,
    y: [
      { formatter: (y) => (typeof y !== 'undefined' ? y.toFixed(0) : y) },
      { formatter: (y) => (typeof y !== 'undefined' ? '$' + y.toFixed(2) + 'k' : y) },
      { formatter: (y) => (typeof y !== 'undefined' ? y.toFixed(0) + ' Sales' : y) },
    ],
  },
};

export const goalsOptions = {
  chart: { height: 300, type: 'radialBar' },
  plotOptions: {
    radialBar: {
      startAngle: -135, endAngle: 135,
      dataLabels: {
        name: { fontSize: '16px', color: undefined, offsetY: 120 },
        value: { offsetY: 76, fontSize: '22px', color: undefined, formatter: (val) => val + '%' },
      },
      track: { background: 'rgba(170,184,197, 0.4)', margin: 0 },
    },
  },
  fill: { gradient: { shade: 'dark', shadeIntensity: 0.2, inverseColors: false, opacityFrom: 1, opacityTo: 1, stops: [0, 50, 65, 91] } },
  stroke: { dashArray: 4 },
  colors: ['#604ae3'],
  series: [75],
  labels: ['Achieved'],
  responsive: [{ breakpoint: 380, options: { chart: { height: 280 } } }],
};