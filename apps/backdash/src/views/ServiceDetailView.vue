<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import mockDataStore from '@/store/mockDataStore';
import LineChart from '@/components/charts/LineChart.vue';
import RouteTable from '@/components/RouteTable.vue';
import LogsViewer from '@/components/LogsViewer.vue';

const route = useRoute();
const router = useRouter();

const serviceId = computed(() => route.params.id);

// Initialize store if needed
onMounted(() => {
  if (!mockDataStore.state.data) {
    mockDataStore.generateData();
  }
});

// Get service details
const service = computed(() => {
  if (!serviceId.value || !mockDataStore.state.data) {
    return null;
  }
  
  return mockDataStore.getServiceById(serviceId.value);
});

// Handle invalid service ID
watch(service, (newValue) => {
  if (newValue === null && mockDataStore.state.data) {
    router.push({ name: 'home' });
  }
});

// Get chart data for the service
const cpuData = computed(() => service.value?.metrics?.cpu?.history || []);
const memoryData = computed(() => service.value?.metrics?.memory?.history || []);
const requestsData = computed(() => service.value?.metrics?.requests?.history || []);
const errorsData = computed(() => service.value?.metrics?.errors?.history || []);
const responseTimeData = computed(() => service.value?.metrics?.responseTime?.history || []);

// Get routes for the service
const routes = computed(() => service.value?.routes || []);

// Get status color
const statusColor = computed(() => {
  if (!service.value) return 'bg-gray-500';
  
  const statusMap = {
    'healthy': 'bg-green-500',
    'warning': 'bg-yellow-500',
    'critical': 'bg-red-500'
  };
  
  return statusMap[service.value.status] || 'bg-gray-500';
});

// Format uptime
const formattedUptime = computed(() => {
  if (!service.value) return 'N/A';
  return service.value.uptime;
});

// Navigate back to home
const goBack = () => {
  router.push({ name: 'home' });
};
</script>

<template>
  <main v-if="service" class="service-detail">
    <div class="container mx-auto px-4 py-6">
      <!-- Header with back button -->
      <div class="mb-6">
        <button 
          v-voix="'back-to-dashboard-button'"
          @click="goBack" 
          class="mb-4 flex items-center text-blue-600 hover:text-blue-800"
        >
          ← Back to Dashboard
        </button>
        
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold">{{ service.name }}</h1>
            <div :class="statusColor" class="ml-3 h-3 w-3 rounded-full"></div>
            <span class="ml-2 text-sm text-gray-500">{{ service.status }}</span>
          </div>
          
          <div class="mt-2 md:mt-0 flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div>Version: {{ service.version }}</div>
            <div>Uptime: {{ formattedUptime }}</div>
            <div>Last Deployed: {{ service.lastDeployed }}</div>
          </div>
        </div>
      </div>
      
      <!-- Metrics Summary -->
      <div class="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">CPU Usage</h3>
          <p class="mt-1 text-2xl font-semibold">{{ service.metrics.cpu.current.toFixed(1) }}%</p>
        </div>
        
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">Memory Usage</h3>
          <p class="mt-1 text-2xl font-semibold">{{ service.metrics.memory.current.toFixed(1) }}%</p>
        </div>
        
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">Request Rate</h3>
          <p class="mt-1 text-2xl font-semibold">{{ service.metrics.requests.current }}/min</p>
        </div>
        
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">Error Rate</h3>
          <p class="mt-1 text-2xl font-semibold">{{ service.metrics.errors.current.toFixed(1) }}%</p>
        </div>
      </div>
      
      <!-- Performance Charts -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4">Performance Metrics</h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white p-4 rounded-lg shadow">
            <h3 class="text-lg font-medium mb-3">CPU Usage</h3>
            <LineChart
              id="cpu-usage-chart"
              :chart-data="cpuData"
              color="#3b82f6"
              :height="200"
            />
          </div>
          
          <div class="bg-white p-4 rounded-lg shadow">
            <h3 class="text-lg font-medium mb-3">Memory Usage</h3>
            <LineChart
              id="memory-usage-chart"
              :chart-data="memoryData"
              color="#10b981"
              :height="200"
            />
          </div>
          
          <div class="bg-white p-4 rounded-lg shadow">
            <h3 class="text-lg font-medium mb-3">Request Volume</h3>
            <LineChart
              id="request-volume-chart"
              :chart-data="requestsData"
              color="#8b5cf6"
              :height="200"
            />
          </div>
          
          <div class="bg-white p-4 rounded-lg shadow">
            <h3 class="text-lg font-medium mb-3">Error Rate</h3>
            <LineChart
              id="error-rate-chart"
              :chart-data="errorsData"
              color="#ef4444"
              :height="200"
            />
          </div>
        </div>
      </div>
      
      <!-- Routes Table -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4">API Routes</h2>
        <RouteTable :routes="routes" />
      </div>
      
      <!-- Service Logs -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4">Service Logs</h2>
        <LogsViewer :service-id="serviceId" />
      </div>
    </div>
  </main>
  
  <div v-else class="h-screen flex items-center justify-center">
    <div class="text-center">
      <p class="text-gray-500 mb-4">Loading service details...</p>
      <button 
        v-voix="'back-to-dashboard-button-loading'"
        @click="goBack" 
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Back to Dashboard
      </button>
    </div>
  </div>
</template>

<style scoped>
.service-detail {
  min-height: 100vh;
  background-color: #f9fafb;
  padding-bottom: 2rem;
}
</style>