<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  icon: {
    type: String,
    default: null
  },
  color: {
    type: String,
    default: '#4CAF50'
  },
  description: {
    type: String,
    default: ''
  },
  statId: {
    type: String,
    required: true
  }
});
</script>

<template>
  <div class="stat-card" :style="{ borderColor: color }">
    <div class="card-icon" v-if="icon" :style="{ backgroundColor: color }">
      <span class="material-icons">{{ icon }}</span>
    </div>
    <div class="card-content">
      <h3 class="card-title" v-voix="`${statId}-title`">{{ title }}</h3>
      <p class="card-value" v-voix="`${statId}-value`">{{ value }}</p>
      <p v-if="description" class="card-description" v-voix="`${statId}-description`">{{ description }}</p>
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  background-color: white;
  border-radius: 8px;
  border-left: 4px solid;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.card-content {
  flex: 1;
}

.card-title {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 4px 0;
}

.card-value {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
  color: #333;
}

.card-description {
  font-size: 0.8rem;
  color: #777;
  margin: 4px 0 0 0;
}
</style>