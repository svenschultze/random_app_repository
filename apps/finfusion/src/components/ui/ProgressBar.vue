<script setup>
defineProps({
  value: {
    type: Number,
    required: true,
    validator: (value) => value >= 0 && value <= 100
  },
  height: {
    type: String,
    default: '8px'
  },
  color: {
    type: String,
    default: 'var(--primary-color)'
  },
  bgColor: {
    type: String,
    default: 'rgba(0, 0, 0, 0.1)'
  },
  radius: {
    type: String,
    default: '4px'
  },
  showLabel: {
    type: Boolean,
    default: false
  },
  labelPosition: {
    type: String,
    default: 'right',
    validator: (value) => ['right', 'top', 'bottom', 'inside'].includes(value)
  },
  animate: {
    type: Boolean,
    default: true
  },
  striped: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="progress-container" :class="[`label-${labelPosition}`]">
    <div 
      v-if="showLabel && (labelPosition === 'top')" 
      class="progress-label"
      v-voix="'Progress Bar showing ' + value + ' percent'"
    >
      {{ value }}%
    </div>
    
    <div 
      class="progress-bar" 
      :style="{ height, borderRadius: radius, backgroundColor: bgColor }"
    >
      <div 
        class="progress-value" 
        :style="{ 
          width: `${value}%`, 
          backgroundColor: color,
          borderRadius: radius,
        }" 
        :class="{ 
          'progress-animate': animate,
          'progress-striped': striped
        }"
      >
        <div v-if="showLabel && labelPosition === 'inside'" class="progress-label-inside">
          {{ value }}%
        </div>
      </div>
    </div>
    
    <div v-if="showLabel && (labelPosition === 'bottom' || labelPosition === 'right')" class="progress-label">
      {{ value }}%
    </div>
  </div>
</template>

<style scoped>
.progress-container {
  display: flex;
  gap: 0.5rem;
  position: relative;
}

.progress-container.label-right {
  align-items: center;
}

.progress-container.label-top {
  flex-direction: column;
}

.progress-container.label-bottom {
  flex-direction: column;
}

.progress-bar {
  flex-grow: 1;
  overflow: hidden;
  position: relative;
}

.progress-value {
  height: 100%;
  position: relative;
}

.progress-label {
  font-size: 0.75rem;
  color: var(--text-color);
  flex-shrink: 0;
}

.progress-label-inside {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.75rem;
  color: white;
  line-height: 1;
}

.progress-animate {
  transition: width 0.6s ease;
}

.progress-striped {
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 1rem 1rem;
}
</style>