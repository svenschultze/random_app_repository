<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  service: {
    type: Object,
    required: true
  },
  id: {
    type: String,
    required: true
  }
});

// Navigate to service detail page
const goToServiceDetail = () => {
  router.push({ name: 'service-detail', params: { id: props.service.id } });
};

// Compute status color
const statusColor = computed(() => {
  const statusMap = {
    'healthy': 'bg-green-500',
    'warning': 'bg-yellow-500',
    'critical': 'bg-red-500'
  };
  
  return statusMap[props.service.status] || 'bg-gray-500';
});

// Compute card border color
const cardBorderColor = computed(() => {
  const borderMap = {
    'healthy': 'border-green-200',
    'warning': 'border-yellow-200',
    'critical': 'border-red-200'
  };
  
  return borderMap[props.service.status] || 'border-gray-200';
});

// Format uptime
const formattedUptime = computed(() => {
  return props.service.uptime || 'N/A';
});

// Format CPU and memory usage
const cpuUsage = computed(() => {
  return props.service.metrics?.cpu?.current?.toFixed(1) + '%' || 'N/A';
});

const memoryUsage = computed(() => {
  return props.service.metrics?.memory?.current?.toFixed(1) + '%' || 'N/A';
});

// Format request rate
const requestRate = computed(() => {
  const rate = props.service.metrics?.requests?.current;
  if (!rate && rate !== 0) return 'N/A';
  
  if (rate >= 1000) {
    return (rate / 1000).toFixed(1) + 'k/min';
  }
  
  return rate + '/min';
});

// Format error rate
const errorRate = computed(() => {
  return props.service.metrics?.errors?.current?.toFixed(1) + '%' || 'N/A';
});
</script>

<template>
  <div 
    v-voix="id" 
    hint="Click to see detailed metrics for this service"
    class="service-card cursor-pointer border rounded-lg p-4 transition-all hover:shadow-md"
    :class="cardBorderColor"
    @click="goToServiceDetail"
  >
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-lg font-medium truncate">{{ service.name }}</h3>
      <div class="flex items-center space-x-2">
        <span class="text-xs">{{ service.version }}</span>
        <div :class="statusColor" class="h-3 w-3 rounded-full"></div>
      </div>
    </div>
    
    <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
      <div class="flex justify-between">
        <span class="text-gray-500">CPU:</span>
        <span>{{ cpuUsage }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-500">Memory:</span>
        <span>{{ memoryUsage }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-500">Requests:</span>
        <span>{{ requestRate }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-500">Errors:</span>
        <span>{{ errorRate }}</span>
      </div>
    </div>
    
    <div class="mt-3 pt-2 border-t text-xs flex justify-between text-gray-500">
      <span>Uptime: {{ formattedUptime }}</span>
      <span>{{ service.lastDeployed }}</span>
    </div>
  </div>
</template>

<style scoped>
.service-card {
  background-color: white;
}
</style>