<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  icon: {
    type: String,
    default: ''
  },
  trend: {
    type: Number,
    default: null
  },
  unit: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: 'blue'
  },
  id: {
    type: String,
    required: true
  }
});

// Compute trend direction
const trendDirection = computed(() => {
  if (props.trend === null) return null;
  return props.trend >= 0 ? 'up' : 'down';
});

// Get color based on trend
const trendColor = computed(() => {
  if (props.trend === null) return '';
  return trendDirection.value === 'up' ? 'text-green-500' : 'text-red-500';
});

// Get trend icon
const trendIcon = computed(() => {
  if (props.trend === null) return '';
  return trendDirection.value === 'up' ? '↑' : '↓';
});

// Format trend value
const formattedTrend = computed(() => {
  if (props.trend === null) return '';
  const value = Math.abs(props.trend);
  return value.toFixed(1) + '%';
});

// Color mapping for the cards
const colorClasses = {
  blue: 'bg-blue-50 border-blue-200 text-blue-800',
  green: 'bg-green-50 border-green-200 text-green-800',
  red: 'bg-red-50 border-red-200 text-red-800',
  yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  purple: 'bg-purple-50 border-purple-200 text-purple-800',
  indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800',
  gray: 'bg-gray-50 border-gray-200 text-gray-800'
};

// Computed class for the card
const cardClass = computed(() => {
  return colorClasses[props.color] || colorClasses.blue;
});
</script>

<template>
  <div v-voix="id" class="metric-card" :class="cardClass">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-medium">{{ title }}</h3>
      <div v-if="icon" class="text-lg opacity-70">{{ icon }}</div>
    </div>
    <div class="mt-2 flex items-baseline">
      <p class="text-2xl font-semibold">{{ value }}</p>
      <p v-if="unit" class="ml-1 text-sm opacity-70">{{ unit }}</p>
    </div>
    <div v-if="trend !== null" class="mt-1 flex items-center text-xs">
      <span :class="trendColor" class="font-medium">
        {{ trendIcon }} {{ formattedTrend }}
      </span>
      <span class="ml-1 opacity-70">from last period</span>
    </div>
  </div>
</template>

<style scoped>
.metric-card {
  padding: 1rem;
  border-radius: 0.5rem;
  border-width: 1px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>