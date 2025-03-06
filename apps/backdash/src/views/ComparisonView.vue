<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import mockDataStore from '@/store/mockDataStore';
import ServiceComparisonChart from '@/components/ServiceComparisonChart.vue';

const router = useRouter();
const excludeHealthy = ref(false);

// Initialize the store on component mount
onMounted(() => {
  if (!mockDataStore.state.data) {
    mockDataStore.generateData();
  }
});

// Navigate back to home
const goBack = () => {
  router.push({ name: 'home' });
};

// Toggle exclude healthy services
const toggleExcludeHealthy = () => {
  excludeHealthy.value = !excludeHealthy.value;
};
</script>

<template>
  <main class="comparison-view">
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
          <h1 class="text-2xl font-bold">Service Comparison</h1>
          
          <div class="flex items-center mt-2 md:mt-0">
            <label class="inline-flex items-center cursor-pointer">
              <input 
                v-voix="'exclude-healthy-toggle'"
                type="checkbox" 
                v-model="excludeHealthy" 
                class="form-checkbox h-5 w-5 text-blue-600"
              />
              <span class="ml-2 text-sm">Show only warning/critical services</span>
            </label>
          </div>
        </div>
      </div>
      
      <!-- Charts Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- CPU Usage Chart -->
        <ServiceComparisonChart 
          metricType="cpu"
          :excludeHealthy="excludeHealthy"
        />
        
        <!-- Memory Usage Chart -->
        <ServiceComparisonChart 
          metricType="memory"
          :excludeHealthy="excludeHealthy"
        />
        
        <!-- Error Rate Chart -->
        <ServiceComparisonChart 
          metricType="errors"
          :excludeHealthy="excludeHealthy"
        />
        
        <!-- Response Time Chart -->
        <ServiceComparisonChart 
          metricType="responseTime"
          :excludeHealthy="excludeHealthy"
        />
      </div>
      
      <!-- Request Rate Chart (full width) -->
      <div class="mb-8">
        <ServiceComparisonChart 
          metricType="requests"
          :excludeHealthy="excludeHealthy"
        />
      </div>
      
      <!-- Explanation -->
      <div class="bg-white p-4 rounded-lg shadow mb-8">
        <h2 class="text-xl font-semibold mb-3">About Service Comparison</h2>
        <p class="text-gray-700 mb-3">
          This view allows you to compare metrics across all microservices in the system. Use the charts to identify:
        </p>
        <ul class="list-disc pl-6 text-gray-700 space-y-1">
          <li>Services with high resource usage (CPU, memory)</li>
          <li>Services with excessive error rates</li>
          <li>Services with slow response times</li>
          <li>Services handling the most requests</li>
        </ul>
        <p class="text-gray-700 mt-3">
          Toggle the "Show only warning/critical services" option to focus on problematic services that may require attention.
        </p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.comparison-view {
  min-height: 100vh;
  background-color: #f9fafb;
  padding-bottom: 2rem;
}

:global(.dark) .comparison-view {
  background-color: #111827;
}

:global(.dark) .bg-white {
  background-color: #1f2937;
}

:global(.dark) .text-gray-700 {
  color: #e5e7eb;
}
</style>