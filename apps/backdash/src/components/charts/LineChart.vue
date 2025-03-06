<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const props = defineProps({
  chartData: {
    type: Array,
    required: true,
    default: () => []
  },
  title: {
    type: String,
    default: ''
  },
  xKey: {
    type: String,
    default: 'time'
  },
  yKey: {
    type: String,
    default: 'value'
  },
  color: {
    type: String,
    default: '#2563eb'
  },
  height: {
    type: Number,
    default: 200
  },
  id: {
    type: String,
    default: 'line-chart'
  }
});

// Format time with hour:minute
function formatTime(dateString) {
  const date = new Date(dateString);
  return date.getHours().toString().padStart(2, '0') + ':' + 
         date.getMinutes().toString().padStart(2, '0');
}

// Prepare chart data from props
const chartOptions = computed(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: props.title ? true : false,
        text: props.title
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 10,
        cornerRadius: 4,
        displayColors: false
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            size: 10
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 0,
          font: {
            size: 10
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4
      }
    }
  };
});

const chartDataComputed = computed(() => {
  if (!props.chartData || props.chartData.length === 0) {
    return {
      labels: [],
      datasets: [
        {
          label: props.title,
          data: [],
          borderColor: props.color,
          backgroundColor: props.color + '20',
          fill: true
        }
      ]
    };
  }

  return {
    labels: props.chartData.map(item => formatTime(item[props.xKey])),
    datasets: [
      {
        label: props.title,
        data: props.chartData.map(item => item[props.yKey]),
        borderColor: props.color,
        backgroundColor: props.color + '20',
        fill: true
      }
    ]
  };
});
</script>

<template>
  <div v-voix="id" class="chart-container" :style="{ height: `${height}px` }">
    <Line :data="chartDataComputed" :options="chartOptions" />
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
}
</style>