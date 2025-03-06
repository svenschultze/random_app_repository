<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import mockDataStore from '@/store/mockDataStore';

const props = defineProps({
  serviceId: {
    type: String,
    default: null
  },
  maxHeight: {
    type: String,
    default: '500px'
  }
});

// Log filters
const levelFilter = ref('all');
const serviceFilter = ref(props.serviceId || 'all');
const searchQuery = ref('');

// Auto scroll to bottom
const autoScroll = ref(true);
const logsContainer = ref(null);

// Applied filters
const filters = computed(() => {
  return {
    level: levelFilter.value !== 'all' ? levelFilter.value : null,
    service: serviceFilter.value !== 'all' ? serviceFilter.value : null,
    search: searchQuery.value.trim() || null
  };
});

// Get filtered logs from store
const logs = computed(() => {
  return mockDataStore.filterLogs(filters.value);
});

// Get available services for the filter dropdown
const availableServices = computed(() => {
  if (!mockDataStore.state.data || !mockDataStore.state.data.services) {
    return [];
  }
  
  return Object.keys(mockDataStore.state.data.services).map(id => ({
    id,
    name: mockDataStore.state.data.services[id].name
  }));
});

// Log level styling
const logLevelClass = (level) => {
  const classes = {
    'INFO': 'bg-blue-100 text-blue-800',
    'WARN': 'bg-yellow-100 text-yellow-800',
    'ERROR': 'bg-red-100 text-red-800'
  };
  
  return classes[level] || 'bg-gray-100 text-gray-800';
};

// Handle filter changes
watch([levelFilter, serviceFilter, searchQuery], () => {
  scrollToBottom();
});

// Scroll to bottom of logs
const scrollToBottom = () => {
  if (!autoScroll.value || !logsContainer.value) return;
  
  setTimeout(() => {
    logsContainer.value.scrollTop = logsContainer.value.scrollHeight;
  }, 0);
};

// Clear filters
const clearFilters = () => {
  levelFilter.value = 'all';
  serviceFilter.value = props.serviceId || 'all';
  searchQuery.value = '';
};

// Initialize
onMounted(() => {
  scrollToBottom();
});
</script>

<template>
  <div class="logs-viewer">
    <!-- Filters -->
    <div class="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label for="level-filter" class="block text-sm font-medium text-gray-700 mb-1">Log Level</label>
        <select
          v-voix="'log-level-filter'"
          id="level-filter" 
          v-model="levelFilter"
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="all">All Levels</option>
          <option value="INFO">INFO</option>
          <option value="WARN">WARN</option>
          <option value="ERROR">ERROR</option>
        </select>
      </div>
      
      <div>
        <label for="service-filter" class="block text-sm font-medium text-gray-700 mb-1">Service</label>
        <select
          v-voix="'log-service-filter'"
          id="service-filter" 
          v-model="serviceFilter"
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          :disabled="!!props.serviceId"
        >
          <option value="all">All Services</option>
          <option v-for="service in availableServices" :key="service.id" :value="service.id">
            {{ service.name }}
          </option>
        </select>
      </div>
      
      <div>
        <label for="search-query" class="block text-sm font-medium text-gray-700 mb-1">Search</label>
        <div class="relative">
          <input
            v-voix="'log-search-input'"
            id="search-query"
            v-model="searchQuery"
            type="text"
            placeholder="Search logs..."
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pr-10"
          />
          <button 
            v-voix="'clear-search-button'"
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
    
    <div class="flex justify-between items-center mb-2">
      <div class="text-sm text-gray-500">
        Showing {{ logs.length }} logs
        <button
          v-voix="'clear-filters-button'"
          v-if="levelFilter !== 'all' || (serviceFilter !== 'all' && serviceFilter !== props.serviceId) || searchQuery"
          @click="clearFilters"
          class="ml-2 text-blue-600 hover:text-blue-800 text-xs"
        >
          Clear filters
        </button>
      </div>
      <div class="flex items-center">
        <input
          v-voix="'auto-scroll-toggle'"
          id="auto-scroll"
          v-model="autoScroll"
          type="checkbox"
          class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label for="auto-scroll" class="ml-2 text-sm text-gray-700">Auto-scroll</label>
      </div>
    </div>
    
    <!-- Logs table -->
    <div 
      ref="logsContainer"
      class="logs-container bg-gray-50 border rounded-md overflow-auto"
      :style="{ maxHeight: maxHeight }"
    >
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100 sticky top-0">
          <tr>
            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
              Timestamp
            </th>
            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
              Level
            </th>
            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-36">
              Service
            </th>
            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Message
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(log, index) in logs" :key="index" class="hover:bg-gray-50">
            <td class="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
              {{ log.timestamp }}
            </td>
            <td class="px-3 py-2 whitespace-nowrap">
              <span :class="logLevelClass(log.level)" class="px-2 py-0.5 rounded-md text-xs font-medium">
                {{ log.level }}
              </span>
            </td>
            <td class="px-3 py-2 whitespace-nowrap text-xs font-medium">
              {{ log.service }}
            </td>
            <td class="px-3 py-2 text-xs text-gray-800">
              {{ log.message }}
              <span class="ml-1 text-gray-400">{{ log.traceId }}</span>
            </td>
          </tr>
          
          <tr v-if="logs.length === 0">
            <td colspan="4" class="px-3 py-4 text-center text-sm text-gray-500">
              No logs found matching the selected filters
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.logs-container {
  overflow-y: auto;
  overflow-x: auto;
}

/* For Firefox */
.logs-container {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.05);
}

/* For Chrome, Edge, and Safari */
.logs-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.logs-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
}

.logs-container::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

/* Hover styles for table rows */
tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.02);
}
</style>