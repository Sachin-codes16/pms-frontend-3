import { currency } from '@/context/constants';

/**
 * Returns statistic card data using live API counts.
 * @param {object} counts - from useDashboardData hook
 */
export const getStatisticData = (counts = {}) => [
  {
    icon: 'solar:buildings-2-broken',
    title: 'No. of Properties',
    amount: counts.properties != null ? String(counts.properties) : '...',
    change: 7.34,
  },
  {
    icon: 'solar:users-group-two-rounded-broken',
    title: 'Regi.Landlords',
    amount: counts.landlords != null ? String(counts.landlords) : '...',
    change: 76.89,
  },
  {
    icon: 'solar:shield-user-broken',
    title: 'Tenants',
    amount: counts.tenants != null ? String(counts.tenants) : '...',
    change: 45.0,
    variant: 'danger',
  },
  {
    icon: 'solar:money-bag-broken',
    title: 'Conversion Rate',
    amount: '78.3%',
    change: 8.76,
  },
];

// Keep the old static export for backward compat (shows '...' placeholders)
export const statisticData = getStatisticData();

export const propertyData = [
  {
    title: 'Property',
    icon: 'solar:home-bold-duotone',
    amount: '15,780',
    progress: 60,
    variant: 'primary',
  },
  {
    title: 'Revenue',
    icon: 'solar:money-bag-bold-duotone',
    amount: `${currency}78.3M`,
    progress: 80,
    variant: 'success',
  },
];

export const chartOptions = {
  chart: {
    height: 95,
    parentHeightOffset: 0,
    type: 'bar',
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      barHeight: '100%',
      columnWidth: '40%',
      borderRadius: 4,
      distributed: true,
    },
  },
  grid: {
    show: false,
    padding: { top: -20, bottom: -10, left: 0, right: 0 },
  },
  colors: ['#eef2f7', '#eef2f7', '#604ae3', '#eef2f7'],
  dataLabels: { enabled: false },
  series: [{ name: 'New Agents', data: [40, 50, 65, 40, 40, 65, 40] }],
  legend: { show: false },
  xaxis: {
    categories: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: { labels: { show: false } },
  tooltip: { enabled: true },
  responsive: [{ breakpoint: 1025, options: { chart: { height: 199 } } }],
};

export const salesChart = {
  chart: {
    height: 341,
    type: 'area',
    dropShadow: { enabled: true, opacity: 0.2, blur: 10, left: -7, top: 22 },
    toolbar: { show: false },
  },
  colors: ['#47ad94', '#604ae3'],
  dataLabels: { enabled: false },
  stroke: { show: true, curve: 'smooth', width: 2, lineCap: 'square' },
  series: [
    {
      name: 'Expenses',
      data: [16800, 16800, 15500, 17000, 14800, 15500, 19000, 16000, 15000, 17000, 14000, 17000],
    },
    {
      name: 'Income',
      data: [16500, 17500, 16200, 21500, 17300, 16000, 16000, 17000, 16000, 19000, 18000, 19000],
    },
  ],
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  xaxis: {
    axisBorder: { show: false },
    axisTicks: { show: false },
    crosshairs: { show: true },
    labels: {
      offsetX: 0,
      offsetY: 5,
      style: { fontSize: '12px', cssClass: 'apexcharts-xaxis-title' },
    },
  },
  yaxis: {
    labels: {
      formatter: (value) => value / 1000 + 'K',
      offsetX: -15,
      offsetY: 0,
      style: { fontSize: '12px', cssClass: 'apexcharts-yaxis-title' },
    },
  },
  grid: {
    borderColor: '#191e3a',
    strokeDashArray: 5,
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: false } },
    padding: { top: -50, right: 0, bottom: 0, left: 5 },
  },
  legend: { show: false },
  fill: {
    type: 'gradient',
    gradient: {
      type: 'vertical',
      shadeIntensity: 1,
      inverseColors: false,
      opacityFrom: 0.12,
      opacityTo: 0.1,
      stops: [100, 100],
    },
  },
  responsive: [{ breakpoint: 575, options: { legend: { offsetY: -50 } } }],
};

export const socialOptions = {
  chart: {
    height: 349,
    type: 'radialBar',
    toolbar: { show: false },
  },
  plotOptions: {
    radialBar: {
      startAngle: -135,
      endAngle: 225,
      hollow: {
        margin: 0,
        size: '70%',
        background: 'transparent',
        image: undefined,
        imageOffsetX: 0,
        imageOffsetY: 0,
        position: 'front',
        dropShadow: { enabled: true, top: 3, left: 0, blur: 4, opacity: 0.24 },
      },
      track: {
        background: 'rgba(170,184,197, 0.4)',
        strokeWidth: '67%',
        margin: 0,
      },
      dataLabels: {
        name: { offsetY: -10, show: true, color: '#888', fontSize: '17px' },
        value: { color: '#111', fontSize: '36px', show: true },
      },
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      type: 'horizontal',
      shadeIntensity: 0.5,
      gradientToColors: ['#7f56da', '#4697ce'],
      inverseColors: true,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 100],
    },
  },
  series: [70],
  stroke: { lineCap: 'round' },
  labels: ['Total Leads'],
};

export const salesOptions = {
  chart: {
    height: 120,
    parentHeightOffset: 0,
    type: 'bar',
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      barHeight: '100%',
      columnWidth: '40%',
      borderRadius: 4,
      distributed: true,
    },
  },
  grid: {
    show: true,
    padding: { top: -20, bottom: -10, left: 0, right: 0 },
  },
  colors: ['#604ae3', '#604ae3', '#604ae3', '#604ae3'],
  dataLabels: { enabled: false },
  series: [{ name: 'Property Sales', data: [40, 50, 65, 45, 40, 70, 40] }],
  legend: { show: false },
  xaxis: {
    categories: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: { labels: { show: true } },
  tooltip: { enabled: true },
  responsive: [{ breakpoint: 1025, options: { chart: { height: 199 } } }],
};