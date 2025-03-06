<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  change: {
    type: [String, Number],
    required: false,
    default: null
  },
  changeType: {
    type: String,
    required: false,
    default: 'neutral',
    validator: (value) => ['positive', 'negative', 'neutral'].includes(value)
  },
  icon: {
    type: String,
    required: false,
    default: null
  },
  loading: {
    type: Boolean,
    required: false,
    default: false
  },
  trend: {
    type: String,
    required: false,
    default: null, // options: 'up', 'down', 'stable'
    validator: (value) => ['up', 'down', 'stable', null].includes(value)
  }
})
</script>

<template>
  <div class="stat-card">
    <div class="stat-icon" v-if="icon">
      <span>{{ icon }}</span>
    </div>
    <div class="stat-content">
      <h4 class="stat-title">{{ title }}</h4>
      <div v-if="loading" class="loading-skeleton"></div>
      <div v-else>
        <p class="stat-value">{{ value }}</p>
        <div v-if="change !== null" class="stat-change" :class="'change-' + changeType">
          <span v-if="trend === 'up'" class="trend-icon">↑</span>
          <span v-else-if="trend === 'down'" class="trend-icon">↓</span>
          <span v-else-if="trend === 'stable'" class="trend-icon">→</span>
          <span>{{ change }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  background-color: var(--card-background);
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  box-shadow: 0 4px 10px var(--shadow-color);
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(var(--primary-color-rgb, 52, 152, 219), 0.1);
  color: var(--primary-color);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  font-size: 1.5rem;
}

.stat-content {
  flex-grow: 1;
}

.stat-title {
  margin: 0 0 0.5rem;
  font-size: 0.875rem;
  color: var(--text-color);
  opacity: 0.7;
}

.stat-value {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
}

.stat-change {
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  margin-top: 0.25rem;
}

.change-positive {
  color: var(--secondary-color, #2ecc71);
}

.change-negative {
  color: #e74c3c;
}

.change-neutral {
  color: var(--text-color);
  opacity: 0.7;
}

.trend-icon {
  margin-right: 0.25rem;
}

.loading-skeleton {
  height: 2rem;
  background: linear-gradient(90deg, var(--border-color) 25%, var(--card-background) 50%, var(--border-color) 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>