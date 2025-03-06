<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['info', 'success', 'warning', 'error'].includes(value)
  }
})

const emit = defineEmits(['close'])

const closeToast = () => {
  emit('close')
}
</script>

<template>
  <div 
    class="notification" 
    :class="[`notification-${type}`]"
    role="alert"
  >
    <div class="notification-content">
      <span class="material-symbols-outlined" :class="type">
        {{ type === 'info' ? 'info' : 
           type === 'success' ? 'check_circle' : 
           type === 'warning' ? 'warning' : 'error' }}
      </span>
      <span class="message">{{ message }}</span>
    </div>
    <button 
      class="close-button" 
      @click="closeToast"
      v-voix="'close-notification'"
      hint="Closes this notification"
    >
      <span class="material-symbols-outlined">close</span>
    </button>
  </div>
</template>

<style scoped>
.notification {
  position: fixed;
  top: 1rem;
  right: 1rem;
  left: 1rem;
  max-width: 400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: var(--border-radius);
  padding: 0.75rem 1rem;
  z-index: 1000;
  animation: slide-in 0.3s forwards;
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.notification-info {
  border-left: 4px solid var(--secondary-color);
}

.notification-success {
  border-left: 4px solid var(--success-color);
}

.notification-warning {
  border-left: 4px solid var(--warning-color);
}

.notification-error {
  border-left: 4px solid var(--error-color);
}

.material-symbols-outlined.info {
  color: var(--secondary-color);
}

.material-symbols-outlined.success {
  color: var(--success-color);
}

.material-symbols-outlined.warning {
  color: var(--warning-color);
}

.material-symbols-outlined.error {
  color: var(--error-color);
}

.message {
  font-size: 0.875rem;
  color: var(--text-primary);
}

.close-button {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  margin-left: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button .material-symbols-outlined {
  font-size: 1.25rem;
}

@keyframes slide-in {
  0% {
    transform: translateY(-2rem);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (min-width: 768px) {
  .notification {
    left: auto;
    width: 400px;
  }
}
</style>