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
  unit: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <div class="stat-card" v-voix="title">
    <div class="stat-card-icon" v-if="icon">
      <i :class="icon"></i>
    </div>
    <div class="stat-card-content">
      <h3 class="stat-card-title">{{ title }}</h3>
      <div class="stat-card-value">
        {{ value }} <span v-if="unit">{{ unit }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  height: 100%;
}

.stat-card-icon {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-size: 1.5rem;
}

.stat-card-content {
  flex: 1;
}

.stat-card-title {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
}

.stat-card-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-top: 0.25rem;
}
</style>