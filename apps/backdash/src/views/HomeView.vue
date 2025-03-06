<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import mockDataStore from '@/store/mockDataStore';
import MetricCard from '@/components/MetricCard.vue';
import ServiceCard from '@/components/ServiceCard.vue';
import LineChart from '@/components/charts/LineChart.vue';
import InsightsPanel from '@/components/InsightsPanel.vue';
import DataRefreshNotification from '@/components/DataRefreshNotification.vue';
import ServiceComparisonChart from '@/components/ServiceComparisonChart.vue';

const router = useRouter();
const isLoading = ref(true);
const selectedMetricType = ref('cpu');

// User settings (pulled from localStorage)
const userSettings = ref({
  autoRefresh: false,
  refreshInterval: 30,
  showStatusIcons: true,
  compactView: false,
  showAllRoutes: false,
});

// Initialize the store and load settings on component mount
onMounted(() => {
  // Generate data if not available
  if (!mockDataStore.state.data) {
    mockDataStore.generateData();
  }
  
  // Load user settings from localStorage
  const savedSettings = localStorage.getItem('backdash_settings');
  if (savedSettings) {
    const settings = JSON.parse(savedSettings);
    userSettings.value = {
      autoRefresh: settings.autoRefresh || false,
      refreshInterval: settings.refreshInterval || 30,
      showStatusIcons: settings.showStatusIcons !== undefined ? settings.showStatusIcons : true,
      compactView: settings.compactView || false,
      showAllRoutes: settings.showAllRoutes || false,
    };
  }
  
  // Simulate loading time for more realistic experience
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
});

// Get system overview data
const overview = computed(() => mockDataStore.state.data?.overview || {});

// Get all services
const services = computed(() => {
  if (!mockDataStore.state.data?.services) {
    return [];
  }
  
  return Object.values(mockDataStore.state.data.services);
});

// Count services by status
const serviceStatusCounts = computed(() => {
  const counts = {
    total: services.value.length,
    healthy: 0,
    warning: 0,
    critical: 0
  };
  
  services.value.forEach(service => {
    counts[service.status] = (counts[service.status] || 0) + 1;
  });
  
  return counts;
});

// Get data for charts
const requestsChartData = computed(() => overview.value?.timeSeriesData?.totalRequests || []);
const errorRateChartData = computed(() => overview.value?.timeSeriesData?.errorRate || []);
const responseTimeChartData = computed(() => overview.value?.timeSeriesData?.responseTime || []);

// Get insights
const insights = computed(() => mockDataStore.state.data?.insights || []);

// Navigate to logs view
const goToLogs = () => {
  router.push({ name: 'logs' });
};

// Navigate to insights view
const goToInsights = () => {
  router.push({ name: 'insights' });
};

// Navigate to comparison view
const goToComparison = () => {
  router.push({ name: 'comparison' });
};

// Handle data refresh
const handleDataRefresh = () => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
  }, 300);
};

// Metric type options for comparison chart selector
const metricOptions = [
  { value: 'cpu', label: 'CPU Usage' },
  { value: 'memory', label: 'Memory Usage' },
  { value: 'errors', label: 'Error Rate' },
  { value: 'responseTime', label: 'Response Time' },
  { value: 'requests', label: 'Request Volume' }
];
</script>

<template>
  <main class="dashboard">
    <div class="container mx-auto px-4 py-6">
      <!-- Header with Data Refresh -->
      <div class="mb-6 flex flex-col md:flex-row md:justify-between md:items-center">
        <h1 class="text-2xl font-bold mb-3 md:mb-0">System Dashboard</h1>
        <DataRefreshNotification 
          :autoRefresh="userSettings.autoRefresh" 
          :refreshInterval="userSettings.refreshInterval * 1000"
          @refresh="handleDataRefresh" 
        />
      </div>
      
      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="animate-pulse">
        <div class="mb-8">
          <div class="h-8 w-48 bg-gray-200 rounded mb-4"></div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div v-for="i in 4" :key="i" class="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
        
        <div class="mb-8">
          <div class="h-8 w-48 bg-gray-200 rounded mb-4"></div>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div v-for="i in 3" :key="i" class="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
      
      <template v-else>
        <!-- System Metrics -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold mb-4">System Health</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              id="cpu-usage-metric"
              title="CPU Usage"
              :value="overview.cpuUsage?.toFixed(1) || 0"
              unit="%"
              icon="💻"
              :trend="5.2"
              color="blue"
            />
            
            <MetricCard
              id="memory-usage-metric"
              title="Memory Usage"
              :value="overview.memoryUsage?.toFixed(1) || 0"
              unit="%"
              icon="📊"
              :trend="-2.7"
              color="green"
            />
            
            <MetricCard
              id="total-requests-metric"
              title="Total Requests"
              :value="overview.totalRequests?.toLocaleString() || 0"
              icon="🔄"
              :trend="12.5"
              color="purple"
            />
            
            <MetricCard
              id="error-rate-metric"
              title="Error Rate"
              :value="overview.errorRate?.toFixed(2) || 0"
              unit="%"
              icon="⚠️"
              :trend="8.3"
              color="red"
            />
          </div>
        </div>
        
        <!-- Services Summary -->
        <div class="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white p-4 rounded-lg shadow">
            <h3 class="text-lg font-medium mb-3">Service Status</h3>
            <div class="flex justify-around text-center">
              <div>
                <div class="text-3xl font-bold text-gray-900">{{ serviceStatusCounts.total }}</div>
                <div class="text-sm text-gray-500">Total</div>
              </div>
              <div>
                <div class="text-3xl font-bold text-green-600">{{ serviceStatusCounts.healthy }}</div>
                <div class="text-sm text-gray-500">Healthy</div>
              </div>
              <div>
                <div class="text-3xl font-bold text-yellow-500">{{ serviceStatusCounts.warning }}</div>
                <div class="text-sm text-gray-500">Warning</div>
              </div>
              <div>
                <div class="text-3xl font-bold text-red-600">{{ serviceStatusCounts.critical }}</div>
                <div class="text-sm text-gray-500">Critical</div>
              </div>
            </div>
          </div>
          
          <div class="bg-white p-4 rounded-lg shadow md:col-span-2">
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-lg font-medium">Service Comparison</h3>
              <select 
                v-voix="'metric-selector'"
                v-model="selectedMetricType"
                class="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option v-for="option in metricOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>
            <ServiceComparisonChart 
              :metricType="selectedMetricType"
              :excludeHealthy="false"
            />
            <div class="text-right mt-2">
              <button 
                v-voix="'compare-all-services-button'"
                @click="goToComparison" 
                class="text-sm text-blue-600 hover:text-blue-800"
              >
                View Full Comparison →
              </button>
            </div>
          </div>
        </div>
        
        <!-- Charts Section -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold mb-4">Performance Trends</h2>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="bg-white p-4 rounded-lg shadow">
              <h3 class="text-lg font-medium mb-3">Request Volume</h3>
              <LineChart
                id="request-volume-chart"
                :chart-data="requestsChartData"
                color="#4f46e5"
                :height="200"
              />
            </div>
            
            <div class="bg-white p-4 rounded-lg shadow">
              <h3 class="text-lg font-medium mb-3">Error Rate</h3>
              <LineChart
                id="error-rate-chart"
                :chart-data="errorRateChartData"
                color="#dc2626"
                :height="200"
              />
            </div>
            
            <div class="bg-white p-4 rounded-lg shadow">
              <h3 class="text-lg font-medium mb-3">Response Time</h3>
              <LineChart
                id="response-time-chart"
                :chart-data="responseTimeChartData"
                color="#0891b2"
                :height="200"
              />
            </div>
          </div>
        </div>
        
        <!-- Services Grid -->
        <div class="mb-8">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">Microservices</h2>
            <div v-if="userSettings.showStatusIcons" class="text-sm">
              <span class="inline-flex items-center mr-4">
                <span class="h-3 w-3 bg-green-500 rounded-full mr-1"></span>
                <span>Healthy</span>
              </span>
              <span class="inline-flex items-center mr-4">
                <span class="h-3 w-3 bg-yellow-500 rounded-full mr-1"></span>
                <span>Warning</span>
              </span>
              <span class="inline-flex items-center">
                <span class="h-3 w-3 bg-red-500 rounded-full mr-1"></span>
                <span>Critical</span>
              </span>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ServiceCard 
              v-for="(service, index) in services" 
              :key="service.id" 
              :service="service" 
              :id="`service-card-${index}`"
            />
          </div>
        </div>
        
        <!-- Insights Panel -->
        <div class="mb-8">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">Recent Insights</h2>
            <button 
              v-voix="'view-all-insights-button'"
              @click="goToInsights" 
              class="text-blue-600 hover:text-blue-800"
            >
              View All
            </button>
          </div>
          
          <div class="bg-white p-4 rounded-lg shadow">
            <InsightsPanel :insights="insights.slice(0, 3)" />
          </div>
        </div>
        
        <!-- Quick Access -->
        <div class="bg-gray-50 p-4 rounded-lg border">
          <h2 class="text-lg font-medium mb-3">Quick Access</h2>
          <div class="flex flex-wrap gap-3">
            <button 
              v-voix="'view-logs-button'"
              @click="goToLogs" 
              class="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
              </svg>
              View Logs
            </button>
            
            <button 
              v-voix="'view-comparison-button'"
              @click="goToComparison"
              class="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              Compare Services
            </button>
            
            <button 
              v-voix="'view-insights-button'"
              @click="goToInsights" 
              class="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
              View Insights
            </button>
          </div>
        </div>
      </template>
    </div>
  </main>
</template>

<style scoped>
.dashboard {
  min-height: 100vh;
  background-color: #f9fafb;
  padding-bottom: 2rem;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
