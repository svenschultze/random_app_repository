<script setup>
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const props = defineProps({
  type: {
    type: String,
    default: 'line',
    validator: (value) => ['line', 'bar'].includes(value)
  },
  data: {
    type: Array,
    required: true
  },
  labels: {
    type: Array,
    required: true
  },
  label: {
    type: String,
    default: 'Activity'
  },
  backgroundColor: {
    type: String,
    default: 'rgba(75, 192, 192, 0.2)'
  },
  borderColor: {
    type: String,
    default: 'rgba(75, 192, 192, 1)'
  },
  height: {
    type: String,
    default: '300px'
  }
});

const chartContainer = ref(null);
let chart = null;

const createChart = () => {
  if (chart) {
    chart.destroy();
  }
  
  const ctx = chartContainer.value.getContext('2d');
  chart = new Chart(ctx, {
    type: props.type,
    data: {
      labels: props.labels,
      datasets: [{
        label: props.label,
        data: props.data,
        backgroundColor: props.backgroundColor,
        borderColor: props.borderColor,
        borderWidth: 1,
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
};

onMounted(() => {
  createChart();
});

watch(() => props.data, () => {
  createChart();
}, { deep: true });

watch(() => props.labels, () => {
  createChart();
}, { deep: true });
</script>

<template>
  <div class="chart-container" :style="{ height }">
    <canvas ref="chartContainer" v-voix="'activity-chart'" hint="Graph displaying activity data over time"></canvas>
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
}
</style>