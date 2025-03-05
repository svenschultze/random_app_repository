<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  isOnline: {
    type: Boolean,
    required: true
  }
})
</script>

<template>
  <div 
    class="connection-status" 
    :class="{ 'is-offline': !isOnline }"
    v-voix="'connection-status'"
    hint="Indicates your internet connection status"
  >
    <div class="indicator"></div>
    <span>{{ isOnline ? 'Online' : 'Offline' }}</span>
  </div>
</template>

<style scoped>
.connection-status {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background-color: white;
  border-radius: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 0.875rem;
  opacity: 0;
  transform: translateY(1rem);
  transition: opacity 0.3s, transform 0.3s;
  z-index: 100;
}

.connection-status.is-offline {
  opacity: 1;
  transform: translateY(0);
}

.indicator {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background-color: var(--success-color);
}

.is-offline .indicator {
  background-color: var(--error-color);
}
</style>