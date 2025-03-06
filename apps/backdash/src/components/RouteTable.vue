<script setup>
import { computed } from 'vue';

const props = defineProps({
  routes: {
    type: Array,
    required: true
  }
});

// Sort routes by request count (highest first)
const sortedRoutes = computed(() => {
  if (!props.routes || props.routes.length === 0) {
    return [];
  }
  
  return [...props.routes].sort((a, b) => b.requestCount - a.requestCount);
});

// Format response time
const formatResponseTime = (time) => {
  if (time >= 1000) {
    return (time / 1000).toFixed(2) + 's';
  }
  return time.toFixed(0) + 'ms';
};

// Format request count
const formatRequestCount = (count) => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count.toString();
};

// Get error rate status class
const getErrorRateClass = (rate) => {
  if (rate >= 5) return 'text-red-600';
  if (rate >= 1) return 'text-yellow-600';
  return 'text-green-600';
};

// Get response time status class
const getResponseTimeClass = (time) => {
  if (time >= 300) return 'text-red-600';
  if (time >= 100) return 'text-yellow-600';
  return 'text-green-600';
};
</script>

<template>
  <div class="route-table">
    <div class="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Path
            </th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Requests
            </th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Avg Response Time
            </th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              P95
            </th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Error Rate
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="route in sortedRoutes" :key="route.path" class="hover:bg-gray-50 transition-colors">
            <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ route.path }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
              {{ formatRequestCount(route.requestCount) }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm" :class="getResponseTimeClass(route.avgResponseTime)">
              {{ formatResponseTime(route.avgResponseTime) }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
              {{ formatResponseTime(route.p95ResponseTime) }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm" :class="getErrorRateClass(route.errorRate)">
              {{ route.errorRate.toFixed(1) }}%
            </td>
          </tr>
          
          <tr v-if="!sortedRoutes.length">
            <td colspan="5" class="px-4 py-4 text-center text-sm text-gray-500">
              No routes found for this service
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* Table hover effect */
.route-table table tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.025);
}
</style>