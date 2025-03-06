<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'info'
  }
})
</script>

<template>
  <div class="empty-state">
    <div class="icon-container">
      <span class="material-symbols-outlined">{{ icon }}</span>
    </div>
    <h3 class="title">{{ title }}</h3>
    <p v-if="description" class="description">{{ description }}</p>
    <div class="actions">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  height: 100%;
  min-height: 200px;
}

.icon-container {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background-color: var(--light-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.icon-container .material-symbols-outlined {
  font-size: 2rem;
  color: var(--primary-color);
}

.title {
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.description {
  margin-bottom: 1.5rem;
  color: var(--text-secondary);
  max-width: 300px;
}

.actions {
  display: flex;
  gap: 1rem;
}
</style>