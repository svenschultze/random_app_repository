<script setup>
import { ref, onBeforeUnmount } from 'vue';
import mockDataStore from '@/store/mockDataStore';

const props = defineProps({
  autoRefresh: {
    type: Boolean,
    default: false
  },
  refreshInterval: {
    type: Number,
    default: 30000 // 30 seconds
  }
});

const emit = defineEmits(['refresh']);

// Track last refresh time
const lastRefreshTime = ref(mockDataStore.state.lastUpdated || new Date().toISOString());
const timeDisplay = ref('');
const isVisible = ref(false);
const refreshTimer = ref(null);

// Format the time display
const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'Never';
  
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now - past;
  
  // Convert to seconds
  const diffSec = Math.floor(diffMs / 1000);
  
  if (diffSec < 60) {
    return `${diffSec} seconds ago`;
  } else if (diffSec < 3600) {
    const mins = Math.floor(diffSec / 60);
    return `${mins} minute${mins > 1 ? 's' : ''} ago`;
  } else {
    const hours = Math.floor(diffSec / 3600);
    const mins = Math.floor((diffSec % 3600) / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ${mins} minute${mins > 1 ? 's' : ''} ago`;
  }
};

// Update the time display
const updateTimeDisplay = () => {
  timeDisplay.value = formatTimeAgo(lastRefreshTime.value);
};

// Set up auto-refresh timer if enabled
const setupAutoRefresh = () => {
  if (props.autoRefresh && props.refreshInterval > 0) {
    refreshTimer.value = setInterval(() => {
      refreshData();
    }, props.refreshInterval);
  }
};

// Handle refresh button click
const refreshData = () => {
  mockDataStore.generateData();
  lastRefreshTime.value = mockDataStore.state.lastUpdated || new Date().toISOString();
  updateTimeDisplay();
  
  // Show notification
  isVisible.value = true;
  setTimeout(() => {
    isVisible.value = false;
  }, 3000);
  
  emit('refresh');
};

// Update time display every 10 seconds
const displayUpdateInterval = setInterval(updateTimeDisplay, 10000);

// Initialize
updateTimeDisplay();
setupAutoRefresh();

// Clean up timers on component unmount
onBeforeUnmount(() => {
  clearInterval(displayUpdateInterval);
  if (refreshTimer.value) {
    clearInterval(refreshTimer.value);
  }
});
</script>

<template>
  <div class="data-refresh">
    <!-- Refresh button and last refreshed time -->
    <div class="flex items-center">
      <button 
        v-voix="'refresh-data-button'"
        hint="Generate new random data for all charts and metrics"
        @click="refreshData" 
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
        </svg>
        Refresh Data
      </button>
      <span class="ml-3 text-sm text-gray-500">Last updated: {{ timeDisplay }}</span>
    </div>
    
    <!-- Refresh notification -->
    <div 
      class="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md transition-opacity"
      :class="{ 'opacity-0': !isVisible, 'opacity-100': isVisible }"
      style="transition: opacity 0.3s ease-in-out;"
    >
      <div class="flex">
        <div class="py-1">
          <svg class="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p class="font-bold">Data refreshed</p>
          <p class="text-sm">Dashboard data has been updated with new random values</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.opacity-0 {
  opacity: 0;
  pointer-events: none;
}

.opacity-100 {
  opacity: 1;
  pointer-events: auto;
}
</style>