export const statData = [{
  title: 'No. of Properties',
  amount: `574`,
  icon: 'solar:calendar-date-bold-duotone',
  variant: 'primary'
}, {
  title: 'Total Buildings',
  amount: `232`,
  icon: 'solar:chart-square-bold-duotone',
  change: 44,
  variant: 'success'
}, {
  title: 'Occupied Properties',
  amount: '274',
  icon: 'solar:user-plus-rounded-bold-duotone',
  variant: 'warning'
}, {
  title: 'Vacant Properties',
  amount: '156',
  icon: 'solar:chart-2-bold-duotone',
  variant: 'info'
}];

export const revenueData = [{
  title: 'Apartment',
  amount: `121`,
  progress: 40,
  variant: 'primary'
}, {
  title: 'Villa',
  amount: `101`,
  progress: 30,
  variant: 'warning'
}, {
  title: 'Warehouse',
  amount: `57`,
  progress: 20,
  variant: 'success'
}, {
  title: 'Commercial',
  amount: `68`,
  progress: 20,
  variant: 'info'
}];

export const countryData = [{
  country: 'Muscat',
  progress: 82.05,
  view: 423,
  icon: 'circle-flags:us',
  variant: 'primary'
}, {
  country: 'Nizwa',
  progress: 70.5,
  view: 234,
  icon: 'circle-flags:ru',
  variant: 'info'
}, {
  country: 'Salalah',
  progress: 65.8,
  view: 124,
  icon: 'circle-flags:cn',
  variant: 'warning'
}, {
  country: 'Sohar',
  progress: 55.8,
  view: 321,
  icon: 'circle-flags:ca',
  variant: 'success'
}];

export const salesFunnelOptions = {
  chart: {
    type: 'line',
    height: 220,
    parentHeightOffset: 0,
    toolbar: {
      show: false
    },
    sparkline: {
      enabled: false
    },
    animations: {
      enabled: false
    },
    dropShadow: {
      enabled: false,
      enabledOnSeries: [2, 3],
      top: 4,
      left: 0,
      blur: 4,
      opacity: 0.12,
      color: ['#604ae3', '#ff8bea', '#604ae3', '#ff8bea']
    }
  },
  series: [
    {
      name: 'Occupied Fill',
      type: 'area',
      data: [32, 58, 46, 73, 54, 31, 42, 24, 38, 25, 48]
    },
    {
      name: 'Vacant Fill',
      type: 'area',
      data: [42, 28, 49, 36, 51, 26, 20, 47, 23, 30, 37]
    },
    {
      name: 'Occupied',
      type: 'line',
      data: [32, 58, 46, 73, 54, 31, 42, 24, 38, 25, 48]
    },
    {
      name: 'Vacant',
      type: 'line',
      data: [42, 28, 49, 36, 51, 26, 20, 47, 23, 30, 37]
    }
  ],
  stroke: {
    width: [0, 0, 2.3, 2.3],
    curve: 'smooth'
  },
  fill: {
    opacity: [0.24, 0, 1, 1],
    type: ['gradient', 'gradient', 'solid', 'solid'],
    gradient: {
      shade: 'light',
      type: 'vertical',
      opacityFrom: 0.34,
      opacityTo: 0,
      stops: [0, 100]
    }
  },
  dataLabels: {
    enabled: false
  },
  markers: {
    size: 0
  },
  colors: ['#604ae3', '#ff8bea', '#604ae3', '#ff8bea'],
  grid: {
    show: false,
    padding: {
      top: -6,
      right: 0,
      bottom: -6,
      left: 0
    }
  },
  xaxis: {
    labels: {
      show: false
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
    tooltip: {
      enabled: false
    }
  },
  yaxis: {
    show: false,
    min: 0,
    max: 74
  },
  legend: {
    show: false
  },
  tooltip: {
    enabled: false
  }
};

export const agentOptions = {
  series: [{
    name: 'Property Sales',
    type: 'bar',
    data: [89.25, 98.58, 68.74, 108.87, 77.54, 84.03, 51.24, 28.57, 92.57, 42.36, 88.51, 36.57]
  }, {
    name: 'Profit Ratio',
    type: 'line',
    data: [35, 35, 25, 25, 45, 45, 75, 75, 45, 45, 54, 54]
  }],
  chart: {
    height: 330,
    type: 'line',
    toolbar: {
      show: false
    }
  },
  stroke: {
    curve: 'straight',
    dashArray: [0, 8],
    width: [0, 2]
  },
  fill: {
    opacity: [4, 1]
  },
  markers: {
    size: [0, 0],
    strokeWidth: 2,
    hover: {
      size: 4
    }
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    axisTicks: {
      show: false
    },
    axisBorder: {
      show: false
    }
  },
  grid: {
    show: true,
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
      top: 0,
      right: -2,
      bottom: 15,
      left: 10
    }
  },
  legend: {
    show: false
  },
  plotOptions: {
    bar: {
      columnWidth: '30%',
      barHeight: '100%',
      borderRadius: 8
    }
  },
  colors: ['#604ae3', '#f8ac59'],
  tooltip: {
    shared: true,
    y: [{
      formatter: function (y) {
        if (typeof y !== 'undefined') {
          return y.toFixed(0);
        }
        return y;
      }
    }, {
      formatter: function (y) {
        if (typeof y !== 'undefined') {
          return '$' + y.toFixed(2) + 'k';
        }
        return y;
      }
    }, {
      formatter: function (y) {
        if (typeof y !== 'undefined') {
          return y.toFixed(0) + ' Sales';
        }
        return y;
      }
    }]
  }
};

export const goalsOptions = {
  chart: {
    height: 300,
    type: 'radialBar'
  },
  plotOptions: {
    radialBar: {
      startAngle: -135,
      endAngle: 135,
      dataLabels: {
        name: {
          fontSize: '16px',
          color: undefined,
          offsetY: 120
        },
        value: {
          offsetY: 76,
          fontSize: '22px',
          color: undefined,
          formatter: function (val) {
            return val + '%';
          }
        }
      },
      track: {
        background: 'rgba(170,184,197, 0.4)',
        margin: 0
      }
    }
  },
  fill: {
    gradient: {
      shade: 'dark',
      shadeIntensity: 0.2,
      inverseColors: false,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 50, 65, 91]
    }
  },
  stroke: {
    dashArray: 4
  },
  colors: ['#604ae3'],
  series: [75],
  labels: ['Achieved'],
  responsive: [{
    breakpoint: 380,
    options: {
      chart: {
        height: 280
      }
    }
  }]
};
