import { currency } from '@/context/constants';

export const statData = [
  {
    icon: 'solar:calendar-date-bold-duotone',
    title: 'Total Check-Ins',
    amount: '128',
    change: 12.5,
    variant: 'primary'
  },
  {
    icon: 'solar:chart-square-bold-duotone',
    title: 'Pending Check-Ins',
    amount: '26',
    change: 8.2,
    variant: 'success'
  },
  {
    icon: 'solar:user-plus-rounded-bold-duotone',
    title: 'Total Check-Outs',
    amount: '32',
    change: 4.7,
    variant: 'warning'
  },
  {
    icon: 'solar:chart-2-bold-duotone',
    title: 'Pending Check-Outs',
    amount: '14',
    change: 3.1,
    variant: 'info'
  },
  {
    icon: 'solar:chart-bold-duotone',
    title: 'Pending Settlements',
    amount: 'OMR 1254',
    change: 2.4,
    variant: 'danger'
  }
];
export const statisticData = statData;
export const propertyData = [{
  title: 'Property',
  icon: 'solar:home-bold-duotone',
  amount: '15,780',
  progress: 60,
  variant: 'primary'
}, {
  title: 'Revenue',
  icon: 'solar:money-bag-bold-duotone',
  amount: `${currency}78.3M`,
  progress: 80,
  variant: 'success'
}];
export const chartOptions = {
  chart: {
    height: 95,
    parentHeightOffset: 0,
    type: 'bar',
    toolbar: {
      show: !1
    }
  },
  plotOptions: {
    bar: {
      barHeight: '100%',
      columnWidth: '40%',
      borderRadius: 4,
      distributed: !0
    }
  },
  grid: {
    show: !1,
    padding: {
      top: -20,
      bottom: -10,
      left: 0,
      right: 0
    }
  },
  colors: ['#eef2f7', '#eef2f7', '#604ae3', '#eef2f7'],
  dataLabels: {
    enabled: !1
  },
  series: [{
    name: 'New Agents',
    data: [40, 50, 65, 40, 40, 65, 40]
  }],
  legend: {
    show: !1
  },
  xaxis: {
    categories: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    axisBorder: {
      show: !1
    },
    axisTicks: {
      show: !1
    }
  },
  yaxis: {
    labels: {
      show: !1
    }
  },
  tooltip: {
    enabled: !0
  },
  responsive: [{
    breakpoint: 1025,
    options: {
      chart: {
        height: 199
      }
    }
  }]
};
export const salesChart = {
  chart: {
    height: 341,
    type: 'area',
    dropShadow: {
      enabled: true,
      opacity: 0.18,
      blur: 10,
      left: 0,
      top: 15,
      color: ['#47ad94', '#604ae3']
    },
    toolbar: {
      show: false
    }
  },
  colors: ['#47ad94', '#604ae3'],
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    curve: 'smooth',
    width: 2,
    lineCap: 'square'
  },
  series: [{
    name: 'Expenses',
    data: [16800, 16800, 15500, 17000, 14800, 15500, 19000, 16000, 15000, 17000, 14000, 17000]
  }, {
    name: 'Income',
    data: [16500, 17500, 16200, 21500, 17300, 16000, 16000, 17000, 16000, 19000, 18000, 19000]
  }],
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  xaxis: {
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
    crosshairs: {
      show: true
    },
    labels: {
      offsetX: 0,
      offsetY: 5,
      style: {
        fontSize: '12px',
        cssClass: 'apexcharts-xaxis-title'
      }
    }
  },
  yaxis: {
    labels: {
      formatter: function (value) {
        return value / 1000 + 'K';
      },
      offsetX: -15,
      offsetY: 0,
      style: {
        fontSize: '12px',
        cssClass: 'apexcharts-yaxis-title'
      }
    }
  },
  grid: {
    borderColor: '#191e3a',
    strokeDashArray: 5,
    xaxis: {
      lines: {
        show: true
      }
    },
    yaxis: {
      lines: {
        show: false
      }
    },
    padding: {
      top: -50,
      right: 0,
      bottom: 0,
      left: 5
    }
  },
  legend: {
    show: false
  },
  fill: {
    type: 'gradient',
    gradient: {
      type: 'vertical',
      shadeIntensity: 1,
      inverseColors: !1,
      opacityFrom: 0.12,
      opacityTo: 0.1,
      stops: [100, 100]
    }
  },
  responsive: [{
    breakpoint: 575,
    options: {
      legend: {
        offsetY: -50
      }
    }
  }]
};
export const statusOverviewOptions = {
  chart: {
    height: 210,
    type: 'donut',
    sparkline: {
      enabled: true
    },
    animations: {
      enabled: false
    }
  },
  labels: ['Checked-In', 'Checked-Out', 'Pending Check-In', 'Pending Check-Out'],
  series: [82, 42, 12, 6],
  colors: ['#58bf7d', '#604ae3', '#ff9142', '#e6ed3f'],
  dataLabels: {
    enabled: false,
  },
  plotOptions: {
    pie: {
      expandOnClick: false,
      donut: {
        size: '45%',
      }
    }
  },
  legend: {
    show: false,
  },
  stroke: {
    show: false
  },
  tooltip: {
    enabled: false
  }
};
export const salesOptions = {
  chart: {
    height: 120,
    parentHeightOffset: 0,
    type: 'bar',
    toolbar: {
      show: !1
    }
  },
  plotOptions: {
    bar: {
      barHeight: '100%',
      columnWidth: '40%',
      // startingShape: "rounded",
      // endingShape: "rounded",
      borderRadius: 4,
      distributed: !0
    }
  },
  grid: {
    show: true,
    padding: {
      top: -20,
      bottom: -10,
      left: 0,
      right: 0
    }
  },
  colors: ['#604ae3', '#604ae3', '#604ae3', '#604ae3'],
  dataLabels: {
    enabled: !1
  },
  series: [{
    name: 'Property Sales',
    data: [40, 50, 65, 45, 40, 70, 40]
  }],
  legend: {
    show: !1
  },
  xaxis: {
    categories: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    axisBorder: {
      show: !1
    },
    axisTicks: {
      show: !1
    }
  },
  yaxis: {
    labels: {
      show: true
    }
  },
  tooltip: {
    enabled: !0
  },
  responsive: [{
    breakpoint: 1025,
    options: {
      chart: {
        height: 199
      }
    }
  }]
};

export const checkInOutOptions = {
  chart: {
    type: 'bar',
    height: 306,
    parentHeightOffset: 0,
    fontFamily: 'inherit',
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '82%',
      borderRadius: 5,
      borderRadiusApplication: 'end',
    },
  },
  dataLabels: { enabled: false },
  stroke: {
    show: true,
    width: 1,
    colors: ['transparent']
  },
  xaxis: {
    tickPlacement: 'between',
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June'],
    axisBorder: { show: true, color: '#8e969f', height: 2 },
    axisTicks: { show: false },
    labels: {
      show: true,
      hideOverlappingLabels: false,
      trim: false,
      offsetY: 4,
      style: {
        colors: '#4f5965',
        fontSize: '12px',
        fontWeight: 400
      }
    }
  },
  yaxis: {
    min: 0,
    max: 40,
    tickAmount: 4,
    labels: {
      offsetX: -8,
      style: {
        colors: '#3f3f3f',
        fontSize: '16px',
        fontWeight: 400
      }
    },
    axisBorder: {
      show: true,
      color: '#8e969f',
      width: 2
    },
    axisTicks: {
      show: false
    }
  },
  grid: {
    show: true,
    borderColor: '#bfc5cc',
    strokeDashArray: 0,
    xaxis: {
      lines: {
        show: false
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    },
    padding: {
      top: -4,
      right: 4,
      bottom: 14,
      left: 16
    }
  },
  fill: {
    opacity: 1,
  },
  colors: ['#3f8fc8', '#f0bd2e'],
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    offsetY: 2,
    offsetX: 0,
    fontSize: '14px',
    fontWeight: 500,
    labels: {
      colors: '#71849d'
    },
    markers: {
      width: 14,
      height: 14,
      radius: 14,
      offsetX: -2
    },
    itemMargin: {
      horizontal: 8,
      vertical: 0
    }
  }
};

export const checkInOutSeries = [
  {
    name: 'Checked-In',
    data: [25, 14, 23, 10, 27, 16]
  },
  {
    name: 'Checked-Out',
    data: [23, 16, 21, 12, 29, 13]
  }
];
