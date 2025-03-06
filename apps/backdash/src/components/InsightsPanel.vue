<script setup>
import { computed } from 'vue';

const props = defineProps({
  insights: {
    type: Array,
    required: true
  }
});

// Sort insights by severity
const sortedInsights = computed(() => {
  if (!props.insights || props.insights.length === 0) {
    return [];
  }

  const severityOrder = {
    'high': 0,
    'medium': 1,
    'low': 2
  };
  
  return [...props.insights].sort((a, b) => {
    // First sort by severity
    const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
    if (severityDiff !== 0) return severityDiff;
    
    // Then sort by timestamp (newest first)
    return new Date(b.timestamp) - new Date(a.timestamp);
  });
});

// Get severity color
const getSeverityColor = (severity) => {
  const colorMap = {
    'high': 'border-red-500 bg-red-50 text-red-700',
    'medium': 'border-yellow-500 bg-yellow-50 text-yellow-700',
    'low': 'border-blue-500 bg-blue-50 text-blue-700'
  };
  
  return colorMap[severity] || 'border-gray-500 bg-gray-50 text-gray-700';
};

// Get type icon
const getTypeIcon = (type) => {
  const iconMap = {
    'performance': '⚡',
    'error': '❌',
    'traffic': '🔄',
    'resource': '📊',
    'security': '🔒'
  };
  
  return iconMap[type] || '📋';
};
</script>

<template>
  <div class="insights-panel">
    <h3 class="text-lg font-medium mb-4">System Insights</h3>
    
    <div v-if="sortedInsights.length === 0" class="text-center text-gray-500 my-10">
      No insights available
    </div>
    
    <div v-else class="grid grid-cols-1 gap-4">
      <div 
        v-for="insight in sortedInsights" 
        :key="insight.id"
        class="insight-card border-l-4 p-4 rounded-md shadow-sm transition-all hover:shadow-md"
        :class="getSeverityColor(insight.severity)"
      >
        <div class="flex items-start">
          <div class="mr-3 text-xl">{{ getTypeIcon(insight.type) }}</div>
          <div class="flex-1">
            <div class="flex justify-between items-start">
              <h4 class="font-medium">{{ insight.message }}</h4>
              <span class="text-xs bg-white bg-opacity-50 px-2 py-0.5 rounded">{{ insight.severity }}</span>
            </div>
            
            <div class="text-sm mt-2 flex justify-between">
              <div>
                <p class="opacity-70">{{ insight.recommendation }}</p>
                <p class="text-xs mt-1 opacity-60">{{ insight.timestamp }}</p>
              </div>
              
              <div v-if="insight.value !== undefined" class="text-right">
                <div class="font-medium">{{ insight.value.toFixed(1) }}</div>
                <div class="text-xs">
                  <span :class="insight.change >= 0 ? 'text-green-600' : 'text-red-600'">
                    {{ insight.change >= 0 ? '↑' : '↓' }} {{ Math.abs(insight.change).toFixed(1) }}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.insight-card {
  transition: transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.insight-card:hover {
  transform: translateY(-1px);
}
</style>