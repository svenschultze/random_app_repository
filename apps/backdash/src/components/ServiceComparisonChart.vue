<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import mockDataStore from '@/store/mockDataStore';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const props = defineProps({
  metricType: {
    type: String,
    default: 'cpu',
    validator: (value) => ['cpu', 'memory', 'requests', 'errors', 'responseTime'].includes(value)
  },
  excludeHealthy: {
    type: Boolean,
    default: false
  }
});

// Metric display information
const metricInfo = {
  cpu: { 
    label: 'CPU Usage', 
    unit: '%', 
    colorStart: '#bfdbfe',  // light blue
    colorEnd: '#1d4ed8'     // dark blue
  },
  memory: { 
    label: 'Memory Usage', 
    unit: '%', 
    colorStart: '#bbf7d0',  // light green
    colorEnd: '#15803d'     // dark green
  },
  requests: { 
    label: 'Request Rate', 
    unit: '/min', 
    colorStart: '#c7d2fe',  // light purple
    colorEnd: '#4338ca'     // dark purple
  },
  errors: { 
    label: 'Error Rate', 
    unit: '%', 
    colorStart: '#fecaca',  // light red
    colorEnd: '#b91c1c'     // dark red
  },
  responseTime: { 
    label: 'Avg Response Time', 
    unit: 'ms', 
    colorStart: '#fef3c7',  // light yellow
    colorEnd: '#b45309'     // dark yellow
  }
};

// Get services from store
const services = computed(() => {
  if (!mockDataStore.state.data?.services) {
    return [];
  }
  
  let result = Object.values(mockDataStore.state.data.services);
  
  // Filter out healthy services if excludeHealthy is true
  if (props.excludeHealthy) {
    result = result.filter(service => service.status !== 'healthy');
  }
  
  return result;
});

// Extract metric values from services
const metricValues = computed(() => {
  return services.value.map(service => {
    return {
      name: service.name,
      value: service.metrics[props.metricType]?.current || 0,
      status: service.status
    };
  }).sort((a, b) => b.value - a.value); // Sort by value in descending order
});

// Generate colors based on service status
const generateColors = (services) => {
  const statusColors = {
    'healthy': '#10b981', // green
    'warning': '#f59e0b', // yellow/amber
    'critical': '#ef4444'  // red
  };
  
  if (props.metricType === 'errors') {
    // For error rates, use a gradient based on value
    return services.map(service => {
      // Calculate color intensity based on error rate
      const intensity = Math.min(1, service.value / 10); // Max at 10%
      return `rgba(239, 68, 68, ${intensity + 0.3})`;
    });
  }
  
  return services.map(service => {
    return statusColors[service.status] || '#6b7280'; // default gray
  });
};

// Prepare chart data
const chartData = computed(() => {
  const labels = metricValues.value.map(item => item.name);
  const data = metricValues.value.map(item => item.value);
  const backgroundColor = generateColors(metricValues.value);
  
  return {
    labels,
    datasets: [
      {
        label: metricInfo[props.metricType]?.label || 'Value',
        data,
        backgroundColor
      }
    ]
  };
});

// Chart options
const chartOptions = computed(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(1) + (metricInfo[props.metricType]?.unit || '');
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: metricInfo[props.metricType]?.label || 'Value'
        },
        ticks: {
          callback: (value) => {
            return value + (metricInfo[props.metricType]?.unit || '');
          }
        }
      }
    }
  };
});
</script>

<template>
  <div class="service-comparison-chart">
    <h3 v-voix="'comparison-chart-title'" class="text-lg font-medium mb-3">{{ metricInfo[metricType]?.label || 'Metric' }} Comparison</h3>
    
    <div class="chart-container" style="position: relative; height: 300px;">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
    
    <div class="text-xs text-center text-gray-500 mt-2">
      <span class="inline-flex items-center mr-3">
        <div class="h-3 w-3 rounded-full bg-green-500 mr-1"></div> Healthy
      </span>
      <span class="inline-flex items-center mr-3">
        <div class="h-3 w-3 rounded-full bg-yellow-500 mr-1"></div> Warning
      </span>
      <span class="inline-flex items-center">
        <div class="h-3 w-3 rounded-full bg-red-500 mr-1"></div> Critical
      </span>
    </div>
  </div>
</template>

<style scoped>
.service-comparison-chart {
  background-color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

:global(.dark) .service-comparison-chart {
  background-color: #1f2937;
}
</style>