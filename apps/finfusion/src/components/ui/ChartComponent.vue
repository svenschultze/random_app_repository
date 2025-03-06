<script setup>
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['line', 'bar', 'pie', 'doughnut', 'radar', 'polarArea'].includes(value)
  },
  data: {
    type: Object,
    required: true
  },
  options: {
    type: Object,
    default: () => ({})
  },
  height: {
    type: String,
    default: '300px'
  },
  width: {
    type: String,
    default: '100%'
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const chartRef = ref(null)
const chart = ref(null)

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        padding: 20,
        boxWidth: 10,
        usePointStyle: true,
        pointStyle: 'circle'
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: 10,
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      cornerRadius: 6,
      displayColors: true
    }
  }
}

const init = () => {
  if (chartRef.value && props.data && props.data.datasets) {
    // Destroy existing chart if it exists
    if (chart.value) {
      chart.value.destroy()
    }
    
    // Create new chart
    const ctx = chartRef.value.getContext('2d')
    chart.value = new Chart(ctx, {
      type: props.type,
      data: props.data,
      options: { ...defaultOptions, ...props.options }
    })
  }
}

onMounted(() => {
  init()
})

watch(() => props.data, () => {
  init()
}, { deep: true })

watch(() => props.type, () => {
  init()
})
</script>

<template>
  <div 
    class="chart-container" 
    :style="{ height, width }"
    v-voix="'Chart showing ' + type + ' data'"
  >
    <div v-if="loading" class="loading-state">
      <div class="loader"></div>
      <p>Loading chart data...</p>
    </div>
    <canvas v-else ref="chartRef"></canvas>
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-color);
  opacity: 0.6;
}

.loader {
  border: 3px solid var(--border-color);
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  margin-bottom: 0.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>