<script setup>
import { computed } from 'vue';

const props = defineProps({
  progress: {
    type: Number,
    required: true,
    validator: (value) => value >= 0 && value <= 100
  },
  size: {
    type: Number,
    default: 120
  },
  strokeWidth: {
    type: Number,
    default: 10
  },
  color: {
    type: String,
    default: '#4CAF50'
  },
  bgColor: {
    type: String,
    default: '#e0e0e0'
  },
  label: {
    type: String,
    default: ''
  }
});

const radius = computed(() => props.size / 2 - props.strokeWidth / 2);
const circumference = computed(() => 2 * Math.PI * radius.value);
const dashoffset = computed(() => circumference.value * (1 - props.progress / 100));
const viewBox = computed(() => `0 0 ${props.size} ${props.size}`);

const innerTextClass = computed(() => {
  return props.progress >= 100 ? 'completed' : '';
});
</script>

<template>
  <div class="progress-ring-container">
    <svg :width="size" :height="size" :viewBox="viewBox" class="progress-ring">
      <circle
        class="progress-ring-bg"
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        :stroke-width="strokeWidth"
        :stroke="bgColor"
        fill="transparent"
      />
      <circle
        class="progress-ring-circle"
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        :stroke-width="strokeWidth"
        :stroke="color"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashoffset"
        fill="transparent"
        stroke-linecap="round"
        transform="rotate(-90 60 60)"
      />
      <text
        :x="size / 2"
        :y="size / 2"
        text-anchor="middle"
        dominant-baseline="middle"
        class="progress-text"
        :class="innerTextClass"
        v-voix="'progress-value'"
      >
        {{ progress }}%
      </text>
      <text
        v-if="label"
        :x="size / 2"
        :y="size / 2 + 20"
        text-anchor="middle"
        dominant-baseline="middle"
        class="progress-label"
        v-voix="'progress-label'"
      >
        {{ label }}
      </text>
    </svg>
  </div>
</template>

<style scoped>
.progress-ring-container {
  display: inline-block;
  position: relative;
}

.progress-ring {
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
}

.progress-ring-circle {
  transition: stroke-dashoffset 0.5s ease;
}

.progress-text {
  transform: rotate(90deg);
  font-size: 1.5rem;
  font-weight: bold;
  fill: #333;
}

.progress-label {
  transform: rotate(90deg);
  font-size: 0.8rem;
  fill: #666;
}

.completed {
  fill: #4CAF50;
}
</style>